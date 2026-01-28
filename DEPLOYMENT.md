# SynthFHIR AWS Deployment Guide

Complete guide for deploying the SynthFHIR stack to AWS.

---

## Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Vercel         │      │   AWS ECS        │      │  AWS RDS/S3     │
│  (Next.js)      │─────▶│   (FastAPI)      │─────▶│  (Optional DB)  │
│  Frontend       │      │   Backend        │      │  Data Storage   │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

---

## Prerequisites

-  AWS Account with CLI configured
- Docker installed locally
- GitHub account
- Vercel account (free tier works)

---

## Part 1: Backend Deployment (AWS ECS/Fargate)

### Step 1: Create ECR Repository

```bash
# Login to AWS
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository
aws ecr create-repository --repository-name synthfhir-backend --region us-east-1
```

### Step 2: Build and Push Docker Image

```bash
# Navigate to your FHIR_Sandbox repo
cd FHIR_Sandbox

# Build Docker image
docker build -t synthfhir-backend:latest .

# Tag for ECR
docker tag synthfhir-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/synthfhir-backend:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/synthfhir-backend:latest
```

### Step 3: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name synthfhir-cluster --region us-east-1
```

### Step 4: Create Task Definition

Create `task-definition.json`:

```json
{
  "family": "synthfhir-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "synthfhir-api",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/synthfhir-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENTERPRISE_BASE_URL",
          "value": "your_llm_api_url"
        }
      ],
      "secrets": [
        {
          "name": "ENTERPRISE_CLIENT_ID",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:synthfhir-client-id"
        },
        {
          "name": "ENTERPRISE_CLIENT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:synthfhir-client-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/synthfhir",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "api"
        }
      }
    }
  ],
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole"
}
```

Register the task definition:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Step 5: Create Application Load Balancer (Optional but Recommended)

```bash
# Create security group for ALB
aws ec2 create-security-group \
  --group-name synthfhir-alb-sg \
  --description "Security group for SynthFHIR ALB" \
  --vpc-id <your-vpc-id>

# Allow inbound HTTPS/HTTP
aws ec2 authorize-security-group-ingress \
  --group-id <sg-id> \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### Step 6: Create ECS Service

```bash
aws ecs create-service \
  --cluster synthfhir-cluster \
  --service-name synthfhir-backend-service \
  --task-definition synthfhir-backend:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<subnet-1>,<subnet-2>],securityGroups=[<sg-id>],assignPublicIp=ENABLED}"
```

### Step 7: Configure Environment Variables (AWS Secrets Manager)

```bash
# Store LLM credentials
aws secretsmanager create-secret \
  --name synthfhir-client-id \
  --secret-string "your_client_id"

aws secretsmanager create-secret \
  --name synthfhir-client-secret \
  --secret-string "your_client_secret"
```

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Push to GitHub

```bash
cd synthfhir-frontend
git init
git add .
git commit -m "Initial commit: SynthFHIR frontend"
git remote add origin https://github.com/<your-username>/synthfhir-frontend.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repo
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables in Vercel

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_API_URL = https://your-backend-alb.us-east-1.elb.amazonaws.com
```

### Step 4: Deploy

Click "Deploy". Vercel will automatically build and deploy.

---

## Part 3: Custom Domain (Optional)

### Backend (Route 53 + ALB)

1. Register domain in Route 53
2. Create SSL certificate in ACM
3. Add HTTPS listener to ALB with certificate
4. Create A record pointing to ALB

### Frontend (Vercel)

1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Part 4: Monitoring & Logs

### CloudWatch Logs

```bash
# View ECS logs
aws logs tail /ecs/synthfhir --follow
```

### Vercel Logs

Available in Vercel dashboard → Deployments → Function Logs

---

## Part 5: CI/CD (Optional)

### GitHub Actions for Backend

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Build and push Docker image
        run: |
          docker build -t synthfhir-backend:latest .
          docker tag synthfhir-backend:latest ${{ secrets.ECR_REPOSITORY }}:latest
          docker push ${{ secrets.ECR_REPOSITORY }}:latest
      
      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster synthfhir-cluster \
            --service synthfhir-backend-service \
            --force-new-deployment
```

---

## Cost Estimation (Monthly)

- **ECS Fargate** (1 vCPU, 2GB RAM): ~$30-40
- **Application Load Balancer**: ~$20-25
- **Vercel** (Free tier): $0
- **Route 53** (Optional): ~$1
- **Total**: ~$50-65/month

---

## Troubleshooting

### Backend not accessible

1. Check security group rules
2. Verify task is running: `aws ecs list-tasks --cluster synthfhir-cluster`
3. Check logs: `aws logs tail /ecs/synthfhir --follow`

### Frontend can't connect to backend

1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check CORS settings in `api/main.py`
3. Test backend directly: `curl https://your-backend-url/api/health`

### LLM not working

1. Verify secrets in AWS Secrets Manager
2. Check task definition environment variables
3. Test LLM connection: `curl https://your-backend-url/api/llm/status`

---

## Alternative: AWS Lambda + API Gateway (Serverless)

For lower traffic, use Lambda instead of ECS:

```bash
# Install dependencies
pip install mangum

# Modify api/main.py
from mangum import Mangum
handler = Mangum(app)

# Deploy with AWS SAM or Serverless Framework
```

---

## Security Best Practices

1. **Never commit secrets** - Use AWS Secrets Manager
2. **Enable HTTPS only** - Force SSL/TLS
3. **Restrict CORS** - Update allowed origins in production
4. **Use VPC** - Run ECS tasks in private subnets
5. **Enable CloudWatch alarms** - Monitor CPU, memory, errors

---

## Next Steps

1. Set up automated backups for generated data
2. Implement rate limiting (API Gateway or ALB rules)
3. Add authentication (AWS Cognito or Auth0)
4. Set up monitoring (CloudWatch dashboards)
5. Configure auto-scaling for ECS service

[
  {
    "name": "cnd-onboarding-api",
    "image": "050752613795.dkr.ecr.us-east-1.amazonaws.com/stamper/cnd-onboarding-api:${image_tag}",
    "essential": true,
    "portMappings": [
      {
        "containerPort": 3000,
        "protocol": "tcp"
      }
    ]
  },
  "cpu": 128,
  "memory": 256
]
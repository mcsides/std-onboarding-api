[
  {
    "name": "onboarding-api",
    "image": "050752613795.dkr.ecr.us-east-1.amazonaws.com/stamper/std-onboarding-api:${image_tag}",
    "essential": true,
    "portMappings": [
      {
        "containerPort": 3000,
        "protocol": "tcp"
      }
    ]
  }
]
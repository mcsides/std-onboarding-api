
data "terraform_remote_state" "stamper_labs_stg" {
  backend = "s3"
  config = {
    bucket = "stamper-labs-tfstate-bucket"
    key    = "base-infra/stg/terraform.tfstate"
    region = "us-east-1"
  }
}

data "terraform_remote_state" "stamper_labs_prod" {
  backend = "s3"
  config = {
    bucket = "stamper-labs-tfstate-bucket"
    key    = "base-infra/prod/terraform.tfstate"
    region = "us-east-1"
  }
}

module "ecs_task_definition_onboarding_api" {
  source                   = "../../module/ecs_task_definition"
  td_family                = "std-stg-ecs-ftask-onboarding-api"
  td_network_mode          = "awsvpc"
  td_compatibilities       = ["FARGATE"]
  td_cpu                   = "256"
  td_memory                = "512"
  td_container_definitions = templatefile( 
    "./container/std-onboarding-api.json.tpl",
    { image_tag = var.image_tag }
    )
  td_execution_role_arn = data.terraform_remote_state.stamper_labs_stg.outputs.ecs_task_execution_role_arn
  env_tag                  = "stg"
}
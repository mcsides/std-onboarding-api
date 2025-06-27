data "terraform_remote_state" "base_infra" {
  backend = "s3"
  config = {
    bucket = "stamper-labs-tfstate-bucket"
    key    = "base-infra/terraform.tfstate"
    region = "us-east-1"
  }
}

module "std_onboarding_api_ecs_task_definition" {
  source                   = "../../module/ecs_task_definition"
  td_family                = "std_onboarding_api_ecs_task_definition"
  td_network_mode          = "awsvpc"
  td_compatibilities       = ["FARGATE"]
  td_cpu                   = "256"
  td_memory                = "512"
  td_container_definitions = templatefile( 
    "./container/std-onboarding-api.json.tpl",
    { image_tag = var.image_tag }
    )
  td_execution_role_arn = data.terraform_remote_state.base_infra.outputs.stamper_role_ecs_tasks_execution_arn
  env_tag                  = "stg"
}
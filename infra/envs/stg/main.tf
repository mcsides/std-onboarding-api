
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

module "ecs_task_definition_nginx" {
  source                   = "../../module/ecs_task_definition"
  td_family                = "std-stg-ecs-ftask-nginx"
  td_network_mode          = "awsvpc"
  td_compatibilities       = ["FARGATE"]
  td_cpu                   = "256"
  td_memory                = "512"
  td_container_definitions = file("./container/nginx.json")
  td_execution_role_arn = data.terraform_remote_state.stamper_labs_stg.outputs.ecs_task_execution_role_arn
  env_tag                  = "stg"
}

module "ecs_service_nginx" {
  source                  = "../../module/ecs_service"
  svc_name                = "std-stg-ecs-fsvc-nginx"
  svc_cluster_id          = data.terraform_remote_state.stamper_labs_stg.outputs.ecs_cluster_id
  svc_task_definition_arn = module.ecs_task_definition_nginx.task_definition_arn
  svc_launch_type         = "FARGATE"
  svc_desired_count       = 3
  svc_subnets             = [data.terraform_remote_state.stamper_labs_prod.outputs.subnet_id]
  svc_security_groups     = [data.terraform_remote_state.stamper_labs_stg.outputs.allow_http_security_group_id]
}

module "ecs_task_definition_onboarding_api" {
  source                   = "../../module/ecs_task_definition"
  td_family                = "std-stg-ecs-ftask-onboarding-api"
  td_network_mode          = "awsvpc"
  td_compatibilities       = ["FARGATE"]
  td_cpu                   = "256"
  td_memory                = "512"
  td_container_definitions = file("./container/nginx.json")
  td_execution_role_arn = data.terraform_remote_state.stamper_labs_stg.outputs.ecs_task_execution_role_arn
  env_tag                  = "stg"
}

module "ecs_service_onboarding_api" {
  source                  = "../../module/ecs_service"
  svc_name                = "std-stg-ecs-fsvc-onboarding-api"
  svc_cluster_id          = data.terraform_remote_state.stamper_labs_stg.outputs.ecs_cluster_id
  svc_task_definition_arn = module.ecs_task_definition_onboarding_api.task_definition_arn
  svc_launch_type         = "FARGATE"
  svc_desired_count       = 3
  svc_subnets             = [data.terraform_remote_state.stamper_labs_prod.outputs.subnet_id]
  svc_security_groups     = [data.terraform_remote_state.stamper_labs_stg.outputs.allow_http_security_group_id]
}
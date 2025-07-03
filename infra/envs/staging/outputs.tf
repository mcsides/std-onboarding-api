output "std_onboarding_api_ecs_task_definition_arn" {
  value = module.std_onboarding_api_ecs_task_definition.arn
}

output "stamper_vpc_subnet_a_public_id" {
  value = data.terraform_remote_state.base_infra.outputs.stamper_vpc_subnet_a_public_id
}

output "stamper_vpc_security_group_id" {
  value = data.terraform_remote_state.base_infra.outputs.stamper_vpc_security_group_id
}

output "cnd_ecs_cluster_staging_name" {
  value = data.terraform_remote_state.base_infra.outputs.cnd_ecs_cluster_staging_name
}
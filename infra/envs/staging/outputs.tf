output "std_onboarding_api_ecs_task_definition_arn" {
  value = module.std_onboarding_api_ecs_task_definition.arn
}

output "stamper_vpc_private_subnet_b_id" {
  value = data.terraform_remote_state.base_infra.outputs.stamper_vpc_private_subnet_b_id
}

output "stamper_vpc_security_group_id" {
  value = data.terraform_remote_state.base_infra.outputs.stamper_vpc_security_group_id
}
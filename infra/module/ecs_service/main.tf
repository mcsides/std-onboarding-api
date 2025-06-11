resource "aws_ecs_service" "stamperlabs_ecs_service" {
  name            = var.svc_name
  cluster         = var.svc_cluster_id
  task_definition = var.svc_task_definition_arn
  desired_count   = var.svc_desired_count
  launch_type     = var.svc_launch_type
  network_configuration {
    subnets          = var.svc_subnets
    security_groups  = var.svc_security_groups
    assign_public_ip = true
  }
}

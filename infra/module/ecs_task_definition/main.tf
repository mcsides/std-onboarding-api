resource "aws_ecs_task_definition" "this" {
  family                   = var.td_family
  network_mode             = var.td_network_mode
  requires_compatibilities = var.td_compatibilities
  cpu                      = var.td_cpu
  memory                   = var.td_memory
  container_definitions    = var.td_container_definitions
  execution_role_arn = var.td_execution_role_arn
  tags = {
    Name        = var.td_family
    Environment = var.env_tag
  }
}

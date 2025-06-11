variable "svc_name" {
  description = "the service name"
  type        = string
}

variable "svc_cluster_id" {
  description = "the ecs cluster id"
  type        = string
}

variable "svc_task_definition_arn" {
  description = "the task definition arn"
  type        = string
}

variable "svc_desired_count" {
  description = "the desired number of running containers"
  type        = number
}

variable "svc_subnets" {
  description = "the subnet"
  type        = set(string)
}

variable "svc_security_groups" {
  description = "the list of security groups"
  type        = list(string)
}

variable "svc_launch_type" {
  description = "the launch type"
  type        = string
}

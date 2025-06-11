
variable "td_family" {
  description = "The task definition fanily"
  type        = string
}

variable "td_network_mode" {
  description = "the task definition network mode"
  type        = string
}

variable "td_compatibilities" {
  description = "the task definition required compatibilities"
  type        = list(string)
}

variable "td_cpu" {
  description = "the cpu allocation for task definition"
  type        = string
}

variable "td_memory" {
  description = "the memory allocation for the task definition"
  type        = string
}

variable "td_container_definitions" {
  type        = string
  description = "the container definition in JSON format"
}

variable "td_execution_role_arn" {
  type        = string
  description = "the execution role arn"
}

# -------------------------
# ------- tags list -------
# -------------------------
variable "env_tag" {
  description = "the environment for tagging"
  type        = string
}

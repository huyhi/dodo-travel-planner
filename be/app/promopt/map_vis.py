MAP_VIS_PROMPT = """

{input}

---

提取上述行程规划中的所有行程点，基于这些行程点，请通过 `generate_pin_map` 这个工具帮我生成一份在该行程目的地 {destination} 的可视化的地图 (pin map)
注意，你只需要提取在 {destination} 的行程点，并在调用 generate_pin_map 时请强调这些行程点都在 {destination} 范围内，以便于 generate_pin_map 工具更好地识别这些地点并生成可视化地图
"""
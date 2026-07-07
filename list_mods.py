import json

transcript_path = r"C:\Users\Lucas\.gemini\antigravity\brain\6b2640ff-461a-4b13-a8c3-09fc523cae76\.system_generated\logs\transcript_full.jsonl"
files = ["App.tsx", "Central.tsx", "Calculators.tsx", "index.css", "Dashboard.tsx", "MenuMore.tsx"]

for line in open(transcript_path, 'r', encoding='utf-8'):
    try:
        step = json.loads(line)
    except:
        continue
    
    if step.get("step_index", 0) < 680:
        continue
        
    if step.get("type") == "PLANNER_RESPONSE":
        for call in step.get("tool_calls", []):
            name = call.get("name") or call.get("function", {}).get("name")
            args = call.get("arguments", {})
            if isinstance(args, str):
                try:
                    args = json.loads(args)
                except:
                    continue
            
            target = args.get("TargetFile", "")
            
            # Print any file modifications in Phase 2
            if name in ["write_to_file", "replace_file_content", "multi_replace_file_content"]:
                print(f"Step {step['step_index']}: {name} -> {target}")

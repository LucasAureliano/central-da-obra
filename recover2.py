import json
import os

transcript_path = r"C:\Users\Lucas\.gemini\antigravity\brain\6b2640ff-461a-4b13-a8c3-09fc523cae76\.system_generated\logs\transcript_full.jsonl"
files = ["App.tsx", "Central.tsx", "Calculators.tsx", "index.css"]
recovered = {f: None for f in files}

for line in open(transcript_path, 'r', encoding='utf-8'):
    try:
        step = json.loads(line)
    except:
        continue
    
    if step.get("step_index", 9999) >= 680:
        continue
        
    if step.get("type") == "PLANNER_RESPONSE":
        for call in step.get("tool_calls", []):
            name = call.get("name") or call.get("function", {}).get("name")
            if name == "write_to_file":
                args = call.get("arguments", {})
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except:
                        continue
                target = args.get("TargetFile", "")
                code = args.get("CodeContent", "")
                
                for f in files:
                    if target.endswith(f):
                        recovered[f] = code

import sys
for f, code in recovered.items():
    if code:
        print(f"Recovered {f} from write_to_file: {len(code)} chars")
        if f == "index.css" or f == "App.tsx":
            out_path = f"C:\\Users\\Lucas\\.gemini\\antigravity\\scratch\\central-da-obra\\src\\{f}"
        else:
            out_path = f"C:\\Users\\Lucas\\.gemini\\antigravity\\scratch\\central-da-obra\\src\\components\\{f}"
            
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(code)

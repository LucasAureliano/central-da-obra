import json
import re
import os

transcript_path = r"C:\Users\Lucas\.gemini\antigravity\brain\6b2640ff-461a-4b13-a8c3-09fc523cae76\.system_generated\logs\transcript_full.jsonl"

files_to_recover = ["App.tsx", "Central.tsx", "Calculators.tsx", "index.css"]

recovered = {}

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
        except:
            continue
            
        if step.get("type") == "TOOL_RESPONSE" and "output" in step.get("content", ""):
            content = step["content"]
            
            for fname in files_to_recover:
                if fname in content and "File Path:" in content:
                    if f"Showing lines 1 to " in content and "The above content shows the entire, complete file contents" in content:
                        lines = content.split('\n')
                        file_content = []
                        is_code = False
                        for l in lines:
                            if l.startswith('1: '):
                                is_code = True
                            if is_code:
                                if l.startswith('The above content'):
                                    break
                                match = re.match(r'^\d+: (.*)$', l)
                                if match:
                                    file_content.append(match.group(1))
                                else:
                                    match_empty = re.match(r'^\d+:$', l)
                                    if match_empty:
                                        file_content.append("")
                                    else:
                                        file_content.append(l)
                        
                        if file_content:
                            recovered[fname] = "\n".join(file_content)

        elif step.get("type") == "PLANNER_RESPONSE" and "tool_calls" in step:
            for call in step["tool_calls"]:
                call_name = call.get("name") or call.get("function", {}).get("name")
                if call_name == "write_to_file":
                    args = call.get("arguments", {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            continue
                    target = args.get("TargetFile", "")
                    code = args.get("CodeContent", "")
                    
                    for fname in files_to_recover:
                        if target.endswith(fname):
                            recovered[fname] = code

import sys
for k, v in recovered.items():
    print(f"Recovered {k}: {len(v)} chars")
    with open(f"C:\\Users\\Lucas\\.gemini\\antigravity\\scratch\\central-da-obra\\recovered_{k}", "w", encoding="utf-8") as f:
        f.write(v)

import json
import re
import os

transcript_path = r"C:\Users\Lucas\.gemini\antigravity\brain\6b2640ff-461a-4b13-a8c3-09fc523cae76\.system_generated\logs\transcript_full.jsonl"
files = ["App.tsx", "Central.tsx", "Calculators.tsx", "index.css", "Dashboard.tsx", "MenuMore.tsx"]
file_contents = {f: None for f in files}

# The user's prompt "REVISÃO COMPLETA DA EXPERIÊNCIA DO USUÁRIO" appears around step 680.
# Let's find the exact step of that prompt.
phase2_start_step = 999999

lines = open(transcript_path, 'r', encoding='utf-8').readlines()

for line in lines:
    try:
        step = json.loads(line)
        if step.get("type") == "USER_INPUT" and "REVISÃO COMPLETA" in step.get("content", ""):
            phase2_start_step = step["step_index"]
            break
    except:
        pass

print(f"Phase 2 started at step: {phase2_start_step}")

# Now we need to find the latest version of the files BEFORE phase2_start_step.
# We will search the transcript for ANY occurrence of the file content in TOOL_RESPONSE or PLANNER_RESPONSE.

for line in lines:
    try:
        step = json.loads(line)
    except:
        continue
        
    if step.get("step_index", 0) >= phase2_start_step:
        continue
        
    if step.get("type") == "TOOL_RESPONSE" and "output" in step.get("content", ""):
        content = step["content"]
        for fname in files:
            if fname in content and "File Path:" in content and "Showing lines 1 to" in content:
                # We have a view_file output.
                # If it's the full file, we can extract it.
                if "The above content shows the entire, complete file contents" in content:
                    lines_content = content.split('\n')
                    parsed_lines = []
                    is_code = False
                    for l in lines_content:
                        if l.startswith('1: '):
                            is_code = True
                        if is_code:
                            if l.startswith('The above content'):
                                break
                            match = re.match(r'^\d+: (.*)$', l)
                            if match:
                                parsed_lines.append(match.group(1))
                            else:
                                match_empty = re.match(r'^\d+:$', l)
                                if match_empty:
                                    parsed_lines.append("")
                                else:
                                    parsed_lines.append(l)
                    if parsed_lines:
                        file_contents[fname] = "\n".join(parsed_lines)

for f, code in file_contents.items():
    if code:
        print(f"Found {f} from view_file: {len(code)} chars")
        if f == "index.css" or f == "App.tsx":
            out_path = f"C:\\Users\\Lucas\\.gemini\\antigravity\\scratch\\central-da-obra\\src\\{f}"
        else:
            out_path = f"C:\\Users\\Lucas\\.gemini\\antigravity\\scratch\\central-da-obra\\src\\components\\{f}"
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(code)

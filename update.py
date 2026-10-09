import json
import re

# Load data
with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

js_data = json.dumps(data, ensure_ascii=False, indent=2)

# Read HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace embedded data
start_marker = 'const data = {'
start_idx = html.find(start_marker)

if start_idx != -1:
    brace_count = 0
    end_idx = start_idx + len(start_marker)
    
    for i in range(start_idx + len(start_marker), len(html)):
        if html[i] == '{':
            brace_count += 1
        elif html[i] == '}':
            if brace_count == 0:
                end_idx = i + 1
                break
            brace_count -= 1
    
    if end_idx > start_idx:
        html = (html[:start_idx + len('const data = ')] + 
                js_data + 
                html[end_idx:])
else:
    pattern = r'(const data = )\{.*?\}(?=\s*;)'
    html = re.sub(pattern, f'\\1{js_data}', html, flags=re.DOTALL)

# Write
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✓ Updated index.html with data from data.json")


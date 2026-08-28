import markdown
import os

md_path = r'C:\Users\veere\.gemini\antigravity-ide\brain\70b54879-5f53-4b82-b7be-b9ef22773fb0\walkthrough.md'
html_path = r'd:\ContractSense\ContractSense_Pitch_Guide.html'

md_text = open(md_path, 'r', encoding='utf-8').read()
html_content = markdown.markdown(md_text, extensions=['tables'])

full_html = f"""
<html>
<head>
<meta charset="utf-8">
<title>ContractSense - Pitch Guide</title>
<style>
    body {{
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        padding: 40px;
        max-width: 900px;
        margin: auto;
        color: #333;
    }}
    h1, h2, h3 {{ color: #2c3e50; }}
    h1 {{ border-bottom: 2px solid #eee; padding-bottom: 10px; }}
    h2 {{ margin-top: 30px; }}
    blockquote {{
        border-left: 4px solid #3498db;
        padding-left: 15px;
        font-style: italic;
        background: #f9f9f9;
        padding: 10px 15px;
        margin: 20px 0;
    }}
    table {{
        border-collapse: collapse;
        width: 100%;
        margin: 20px 0;
    }}
    th, td {{
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
    }}
    th {{ background-color: #f5f6fa; }}
    code {{
        background: #f4f4f4;
        padding: 2px 5px;
        border-radius: 3px;
        font-family: monospace;
    }}
</style>
</head>
<body>
{html_content}
</body>
</html>
"""

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(full_html)

print("HTML generated successfully. You can open it in any browser and print to PDF.")

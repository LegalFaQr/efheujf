from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import re, json
root=Path("D:/KabiraInternationa;/dist")
class Check(HTMLParser):
 def __init__(self):
  super().__init__(); self.ids=[]; self.links=[]; self.assets=[]; self.images=[]; self.tabs=[]; self.panels=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if "id" in a:self.ids.append(a["id"])
  if tag=="a":self.links.append(a.get("href",""))
  if tag=="img":
   self.images.append(a);self.assets.append(a["src"])
   for part in a.get("srcset","").split(","):
    if part.strip():self.assets.append(part.strip().split()[0])
  if tag=="script" and a.get("src"):self.assets.append(a["src"])
  if tag=="link" and a.get("rel")=="stylesheet" and not a["href"].startswith("http"):self.assets.append(a["href"])
  if a.get("role")=="tab":self.tabs.append(a)
  if a.get("role")=="tabpanel":self.panels.append(a)
html=(root/"index.html").read_text(encoding="utf-8")
p=Check();p.feed(html)
assert len(p.ids)==len(set(p.ids)), "Duplicate element IDs"
assert all(x=="#" or x[1:] in p.ids for x in p.links if x.startswith("#")), "Missing navigation target"
assert all((root/x).is_file() for x in p.assets), "Missing local asset"
assert all("alt" in x and "width" in x and "height" in x for x in p.images), "Image metadata missing"
assert len(p.tabs)==4 and sum(x.get("aria-selected")=="true" for x in p.tabs)==1
assert all(x["aria-controls"] in p.ids for x in p.tabs)
assert not re.search(r"mailto:|tel:|wa\.me|9988369035|9115104300|@gmail|12345",html,re.I)
css=(root/"styles.css").read_text(encoding="utf-8")
assert css.count("{")==css.count("}")
assert "object-fit:cover" not in css, "Unexpected image crop"
assert "prefers-reduced-motion" in css
print(json.dumps({"internal_links":"pass","unique_ids":"pass","responsive_image_sources":"pass","programme_tab_structure":"pass","phone_and_email_exclusion":"pass","image_cropping":"none","assets_bytes":sum(f.stat().st_size for f in (root/"assets").iterdir()),"images":len(p.images),"browser_visual_QA":"unavailable: Windows sandbox startup fails"}))

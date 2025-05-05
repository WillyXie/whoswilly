#!python3

import os
import re

"""
Parse source files
"""
def get_dictNote():
  # Get note content from ./src
  dictNote = []
  root = os.path.dirname(os.path.realpath(__file__))
  files = os.listdir(f"{root}/src")
  print(f"File list: {files}")

  pattern_header = re.compile(r"<h[1-3].*id=\"(.*)\".*>(.*)</h[1-3]>")
  for file in files:
    print(f"Parsing content from: {file}")
    chapters = []
    with open(f"{root}/src/{file}", "r") as f:
      content = f.readlines()
      for line in content:
        # Match header element
        match = pattern_header.match(line)
        if match:
          chapters.append((match.group(1), match.group(2)))
      dictNote.append({"file":file, "title":file[:-5],
                       "chapters":chapters, "content":content})

  return dictNote

"""
Main function
"""
def main():
  dictNote = get_dictNote()

  for note in dictNote:
    with open(f"notes/{note["file"]}", "w") as f:
      f.write("<!doctype html>\n")
      f.write("<html lang=\"en-US\">\n")
      f.write("\t<head>\n")
      f.write("\t\t<meta charset=\"utf-8\" />\n")
      f.write("\t\t<meta name=\"viewport\" content=\"width=device-width\" />\n")
      f.write(f"\t\t<title>{note["title"]}</title>\n")
      f.write("\t\t<link href=\"style/style.css\", rel=\"stylesheet\"</link>\n")
      f.write("\t</head>\n\n")
      f.write("\t<body>\n")
      f.write("\t\t<div class=\"borderBox\" id=\"divRoot\">\n")
      f.write("\t\t\t<div class=\"borderBox\" id=\"divTop\">\n")
      f.write("\t\t\t\t<a href=\"bookshelf.html\">Willy's Bookshelf</a></li>\n")
      f.write("\t\t\t</div> <!-- divTop -->\n")
      # Page with links
      f.write("\t\t\t<div class=\"borderBox\" id=\"divLeft\">\n")
      # Chapter link
      for chapter in note["chapters"]:
        f.write(f"\t\t\t\t\t<a href=\"#{chapter[0]}\">{chapter[1]}</a></br>\n")
      f.write("\t\t\t</div> <!-- divLeft -->\n")
      f.write("\t\t\t<div class=\"borderBox\" id=\"divMain\">\n")
      # Page without links

      for line in note["content"]:
        f.write(f"\t\t\t\t{line}")

      f.write("\t\t\t</div> <!-- divMain -->\n")
      f.write("\t\t</div><!-- divRoot -->\n")
      f.write("\t</body>\n")
      f.write("</html>\n")

  # Generate
  with open(f"notes/bookshelf.html", "w") as f:
    f.write("<!doctype html>\n")
    f.write("<html lang=\"en-US\">\n")
    f.write("\t<head>\n")
    f.write("\t\t<meta charset=\"utf-8\" />\n")
    f.write("\t\t<meta name=\"viewport\" content=\"width=device-width\" />\n")
    f.write(f"\t\t<title>Willy's Bookshelf</title>\n")
    f.write("\t\t<link href=\"style/style.css\", rel=\"stylesheet\"</link>\n")
    f.write("\t</head>\n\n")
    f.write("\t<body>\n")
    f.write("\t\t<div class=\"borderBox\" id=\"divRoot\">\n")
    f.write("\t\t\t<div class=\"borderBox\" id=\"divTop\">\n")
    f.write("\t\t\t\t<h3>Welcome to my little corner for knowledge notes!!</h3>\n")
    f.write("\t\t\t</div> <!-- divTop -->\n")
    f.write("\t\t\t<div class=\"borderBox\" id=\"divLeft\">\n")
    f.write("\t\t\t\t<h2>Notes</h2>\n")

    for note in dictNote:
      f.write(f"\t\t\t\t\t<a href=\"{note["file"]}\">{note["title"]}</a>\n")

    f.write("\t\t\t</div> <!-- divLeft -->\n")
    f.write("\t\t</div><!-- divRoot -->\n")
    f.write("\t</body>\n")
    f.write("</html>\n")

  return 0

"""
Execution entry point
"""
if __name__ == "__main__":
  main()

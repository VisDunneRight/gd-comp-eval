import csv
import json
import argparse

# Modify these for easier running
# The includeProp lets the parse know which data values and their types to process
# These are the required field.
includeProp = {
  "Name":"String",
  "Authors": "MultiSelect",
  "Bibtex": "String",
  "DOI": "String",
  "Year": "Timeline",
  "Graph Feature": "MultiSelect",
  "Results Measured": "MultiSelect",
  "Dataset Size": "String",
  "Dataset Tag": "MultiSelect",
  "Does Provide Code": "MultiSelect",
  "Evaluation Type": "MultiSelect",
  "Easy to find info about graphs?": "MultiSelect",
  "Size of Graphs": "String",
  "Supplemental Material": "MultiSelect",
  "Type of Dataset Edit": "String",
  "Storage Supplemental Material": "MultiSelect",
}

with open(filename, encoding='utf-8-sig') as csvfile:
  spamreader = csv.reader(csvfile)
  jsonfile = {"meta":[], "filterBy":[], "detailView":[], "summaryView":[], "data":[]}
  header = []
  # Get header information
  for row in spamreader:
    for name in row:
      header.append(name)
      if name in includeProp:
        jsonfile["meta"].append({'name': name, "type":includeProp[name]})
        jsonfile["filterBy"].append(name)
        jsonfile["detailView"].append(name)
    break

    propStructure = {}
    for prop in includeProp:
      propStructure[prop] = {"name":prop, "values":set()}

    for row in spamreader:
      entry = {}
      for index, prop in enumerate(row):
        if header[index] in includeProp:
          if includeProp[header[index]] == "MultiSelect":
            entry[header[index]] = [x.strip() for x in prop.split(",")] 
          else:
            entry[header[index]] = prop.strip()
          if includeProp[header[index]] == "MultiSelect":
            propList = [x.strip() for x in prop.split(",")] 
            for doc in propList:
              propStructure[header[index]]['values'].add(doc)
      jsonfile["data"].append(entry)
    
    dataObject = json.dumps(jsonfile, indent=4)
    # Writing to survey-data.json
    with open("survey-data.json", "w") as outfile:
        outfile.write(dataObject)
    
    if args.onlydata == False:
      for i in range(len(configfile["filterBy"])):
        name = configfile["filterBy"][i]
        propStructure[name]['values'] = list(propStructure[name]['values'] )
        configfile["filterBy"][i] = propStructure[name]

      with open("survey-config.json", "w") as outfile:
          configObject= json.dumps(configfile, indent=4)
          outfile.write(configObject)

if __name__ == '__main__':
  main()
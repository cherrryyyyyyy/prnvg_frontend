import os
import json


def read_all_json_files(folder_path):
    json_data_list = []

    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)

                with open(file_path, 'r', encoding='utf-8') as json_file:
                    try:
                        data = json.load(json_file)
                        #print(data["objects"][0]["external_references"][0]['external_id'])
                        new_filename = data["objects"][0]["external_references"][0]['external_id']
                        new_file_path = os.path.join(folder_path, f"{new_filename}.json")
                    except json.JSONDecodeError as e:
                        print(f'Error reading {file_path}: {e}')
                    except OSError as e:
                        print(f"Error renaming {json_file}: {e}")
                os.rename(file_path, new_file_path)


    return json_data_list


folder_path = "D:\\code\\prnvg_fronted\\prnvg_fronted\\src\\technique"

all_json_data = read_all_json_files(folder_path)

for idx, data in enumerate(all_json_data):
    print(f"JSON file {idx + 1}")
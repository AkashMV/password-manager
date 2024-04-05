import os

def generate_ascii_tree(directory, indent=''):
    tree = ''
    items = os.listdir(directory)
    items.sort()
    
    for i, item in enumerate(items):
        if(item == 'node_modules' or item==".git"):
            tree += f'{indent}{"└──" if is_last else "├──"}{item}/\n'
            continue
        path = os.path.join(directory, item)
        is_last = i == len(items) - 1
        
        if os.path.isdir(path):
            tree += f'{indent}{"└──" if is_last else "├──"}{item}/\n'
            if is_last:
                tree += generate_ascii_tree(path, indent + '    ')
            else:
                tree += generate_ascii_tree(path, indent + '│   ')
        else:
            tree += f'{indent}{"└──" if is_last else "├──"}{item}\n'
    
    return tree

if __name__ == '__main__':
    current_directory = os.getcwd()
    ascii_tree = generate_ascii_tree(current_directory)
    print(ascii_tree)
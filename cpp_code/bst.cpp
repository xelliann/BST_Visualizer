#include <iostream>
#include <memory>
#include <cstdlib>  // for system()

const int SPACE = 4;
using namespace std;

class TreeNode {
public:
    int value;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int v = 0) : value(v), left(nullptr), right(nullptr) {}
};

class BST {
public:
    TreeNode* root;

    BST() : root(nullptr) {}

    bool isEmpty() const {
        return root == nullptr;
    }

    void insertNode(TreeNode* new_node) {
        if (root == nullptr) {
            root = new_node;
            cout << "Value inserted as root node" << endl;
        } else {
            TreeNode* temp = root;
            while (true) {
                if (new_node->value == temp->value) {
                    cout << "Value already exists" << endl;
                    return;
                } else if (new_node->value < temp->value) {
                    if (temp->left == nullptr) {
                        temp->left = new_node;
                        cout << "Node inserted" << endl;
                        break;
                    } else {
                        temp = temp->left;
                    }
                } else {
                    if (temp->right == nullptr) {
                        temp->right = new_node;
                        cout << "Node inserted" << endl;
                        break;
                    } else {
                        temp = temp->right;
                    }
                }
            }
        }
    }

    void printPreorder(TreeNode* r) const {
        if (r == nullptr)
            return;
        cout << r->value << endl;
        printPreorder(r->left);
        printPreorder(r->right);
    }

    void printInorder(TreeNode* r) const {
        if (r == nullptr)
            return;
        printInorder(r->left);
        cout << r->value << endl;
        printInorder(r->right);
    }

    void printPostorder(TreeNode* r) const {
        if (r == nullptr)
            return;
        printPostorder(r->left);
        printPostorder(r->right);
        cout << r->value << endl;
    }

    TreeNode* minvalue(TreeNode* r) const {
        TreeNode* current = r;
        while (current && current->left != nullptr) {
            current = current->left;
        }
        return current;
    }

    TreeNode* deleteNode(TreeNode* r, int v) {
        if (r == nullptr) {
            return nullptr;
        } else if (v < r->value) {
            r->left = deleteNode(r->left, v);
        } else if (v > r->value) {
            r->right = deleteNode(r->right, v);
        } else {
            if (r->left == nullptr) {
                TreeNode* temp = r->right;
                delete r;
                return temp;
            } else if (r->right == nullptr) {
                TreeNode* temp = r->left;
                delete r;
                return temp;
            } else {
                TreeNode* temp = minvalue(r->right);
                r->value = temp->value;
                r->right = deleteNode(r->right, temp->value);
            }
        }
        return r;
    }
};

int main() {
    BST obj;
    int option, val;

    do {
        cout << "1. Insert node" << endl;
        cout << "2. Search node" << endl;
        cout << "3. Delete node" << endl;
        cout << "4. Print BST values" << endl;
        cout << "5. Clear Screen" << endl;
        cout << "0. Exit Program" << endl;
        cin >> option;

        switch (option) {
            case 1: {
                cout << "Enter value to insert in node: ";
                cin >> val;
                TreeNode* new_node = new TreeNode(val);
                obj.insertNode(new_node);
                cout << endl;
                break;
            }
            case 2:
                cout << "Search node functionality not implemented" << endl;
                break;
            case 3: {
                cout << "Enter value to delete: ";
                cin >> val;
                obj.root = obj.deleteNode(obj.root, val);
                break;
            }
            case 4: {
                int a;
                cout << "Enter the way you want to print the values:" << endl;
                cout << "1 -> Pre-Order" << endl;
                cout << "2 -> Post-Order" << endl;
                cout << "3 -> In-Order" << endl;
                cin >> a;
                switch (a) {
                    case 1:
                        obj.printPreorder(obj.root);
                        break;
                    case 2:
                        obj.printPostorder(obj.root);
                        break;
                    case 3:
                        obj.printInorder(obj.root);
                        break;
                    default:
                        cout << "Enter either 1, 2, or 3 in the input" << endl;
                        break;
                }
                break;
            }
            case 5:
                cout << "Clear Screen" << endl;
                system("clear");  // Use system("cls") for Windows systems
                break;
            case 0:
                break;
            default:
                cout << "Enter a proper Number" << endl;
                break;
        }
    } while (option != 0);

    return 0;
}

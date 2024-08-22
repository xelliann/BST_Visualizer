class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = {
            value: value,
            left: null,
            right: null
        };

        if (this.root === null) {
            this.root = newNode;
            this.log(`Value ${value} inserted as root node`);
        } else {
            this._insertNode(this.root, newNode);
        }
        this.renderTree();
    }

    _insertNode(root, newNode) {
        if (newNode.value < root.value) {
            if (root.left === null) {
                root.left = newNode;
                this.log(`Value ${newNode.value} inserted`);
            } else {
                this._insertNode(root.left, newNode);
            }
        } else if (newNode.value > root.value) {
            if (root.right === null) {
                root.right = newNode;
                this.log(`Value ${newNode.value} inserted`);
            } else {
                this._insertNode(root.right, newNode);
            }
        } else {
            this.log(`Value ${newNode.value} already exists`);
        }
    }

    delete(value) {
        this.root = this._deleteNode(this.root, value);
        this.renderTree();
    }

    _deleteNode(root, value) {
        if (root === null) {
            this.log(`Value ${value} not found`);
            return null;
        }

        if (value < root.value) {
            root.left = this._deleteNode(root.left, value);
        } else if (value > root.value) {
            root.right = this._deleteNode(root.right, value);
        } else {
            if (root.left === null) {
                this.log(`Value ${value} deleted`);
                return root.right;
            } else if (root.right === null) {
                this.log(`Value ${value} deleted`);
                return root.left;
            }

            root.value = this._minValue(root.right);
            root.right = this._deleteNode(root.right, root.value);
            this.log(`Value ${value} deleted`);
        }
        return root;
    }

    _minValue(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current.value;
    }

    search(value) {
        const result = this._searchNode(this.root, value);
        if (result !== null) {
            this.log(`Found value ${value} in the BST`);
        } else {
            this.log(`Value ${value} not found in the BST`);
        }
    }

    _searchNode(root, value) {
        if (root === null || root.value === value) {
            return root;
        }

        if (value < root.value) {
            return this._searchNode(root.left, value);
        } else {
            return this._searchNode(root.right, value);
        }
    }

    renderTree() {
        const svg = d3.select("#treeCanvas");
        svg.selectAll("*").remove();

        const renderNode = (node, x, y, depth) => {
            if (node !== null) {
                svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 20)
                    .attr("fill", "#4CAF50");

                svg.append("text")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .text(node.value);

                const horizontalSpacing = 100 - depth * 10;
                const verticalSpacing = 50;

                if (node.left !== null) {
                    svg.append("line")
                        .attr("x1", x)
                        .attr("y1", y)
                        .attr("x2", x - horizontalSpacing)
                        .attr("y2", y + verticalSpacing)
                        .attr("stroke", "#ccc")
                        .attr("stroke-width", 2);
                    renderNode(node.left, x - horizontalSpacing, y + verticalSpacing, depth + 1);
                }

                if (node.right !== null) {
                    svg.append("line")
                        .attr("x1", x)
                        .attr("y1", y)
                        .attr("x2", x + horizontalSpacing)
                        .attr("y2", y + verticalSpacing)
                        .attr("stroke", "#ccc")
                        .attr("stroke-width", 2);
                    renderNode(node.right, x + horizontalSpacing, y + verticalSpacing, depth + 1);
                }
            }
        };

        renderNode(this.root, svg.attr("width") / 2, 40, 1);
    }

    log(message) {
        const consoleDiv = document.getElementById('console');
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        consoleDiv.appendChild(messageDiv);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }
}

const bst = new BST();

document.addEventListener('DOMContentLoaded', function() {
    const actionSelect = document.getElementById('action');
    const nodeValueInput = document.getElementById('nodeValue');
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', function() {
        const value = parseInt(nodeValueInput.value);
        if (!isNaN(value)) {
            const action = actionSelect.value;
            if (action === 'insert') {
                bst.insert(value);
            } else if (action === 'delete') {
                bst.delete(value);
            } else if (action === 'search') {
                bst.search(value);
            } else {
                console.log('Action not recognized');
            }
            nodeValueInput.value = '';
        } else {
            alert('Please enter a valid number.');
        }
    });
});

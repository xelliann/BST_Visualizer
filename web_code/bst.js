console.log('Script loaded');

class Node {
    constructor(value, depth = 0) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.position = { x: 0, y: 0 };
        this.depth = depth;
    }
}

class BST {
    constructor() {
        this.root = null;
        this.nodeRadius = 20;
        this.initialHorizontalSpacing = 100; // Increased base spacing
        this.spacingIncrement = 30; // Increased spacing increment
        this.currentHorizontalSpacing = this.initialHorizontalSpacing; // Current spacing value
        this.verticalSpacing = 100;   // Increased vertical spacing
    }

    insert(value) {
        const newNode = new Node(value);

        if (this.root === null) {
            this.root = newNode;
            this.root.position = {
                x: document.getElementById("treeCanvas").getBoundingClientRect().width / 2,
                y: 40
            };
            this.renderTree(); // Render immediately after setting the initial position
        } else {
            this.insertNode(this.root, newNode);
            this.updatePositions(this.root, document.getElementById("treeCanvas").getBoundingClientRect().width / 2, 40, this.currentHorizontalSpacing);
            this.renderTree();
        }

        // Increase spacing for the next insertion
        this.currentHorizontalSpacing += this.spacingIncrement;
    }

    insertNode(currentNode, newNode, depth = 1) {
        newNode.depth = depth;
        if (newNode.value < currentNode.value) {
            if (currentNode.left === null) {
                currentNode.left = newNode;
            } else {
                this.insertNode(currentNode.left, newNode, depth + 1);
            }
        } else {
            if (currentNode.right === null) {
                currentNode.right = newNode;
            } else {
                this.insertNode(currentNode.right, newNode, depth + 1);
            }
        }
    }

    updatePositions(node, x, y, spacing) {
        if (node !== null) {
            node.position = { x: x, y: y };
            const nextY = y + this.verticalSpacing;

            if (node.left !== null) {
                this.updatePositions(node.left, x - spacing, nextY, spacing / 2);
            }
            if (node.right !== null) {
                this.updatePositions(node.right, x + spacing, nextY, spacing / 2);
            }
        }
    }

    delete(value) {
        this.root = this._deleteNode(this.root, value);
        this.updatePositions(this.root, document.getElementById("treeCanvas").getBoundingClientRect().width / 2, 40, this.currentHorizontalSpacing);
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
        console.log('Rendering tree...');
        const svg = d3.select("#treeCanvas");
        svg.selectAll("*").remove(); // Clear existing content

        // Render nodes and curved lines
        this.renderNode(svg, this.root);

        // Adjust SVG dimensions
        this.adjustSVGSize(svg);
    }

    adjustSVGSize(svg) {
        const nodes = this.getNodes();
        if (nodes.length === 0) return;

        const maxX = d3.max(nodes, node => node.position.x + this.nodeRadius);
        const minX = d3.min(nodes, node => node.position.x - this.nodeRadius);
        const maxY = d3.max(nodes, node => node.position.y + this.nodeRadius);
        const minY = d3.min(nodes, node => node.position.y - this.nodeRadius);

        const margin = 20;
        const width = Math.max(maxX - minX + this.nodeRadius * 2, window.innerWidth / 2);
        const height = Math.max(maxY - minY + this.nodeRadius * 2, window.innerHeight / 2);

        svg.attr("width", width)
            .attr("height", height)
            .attr("viewBox", `${minX - margin} ${minY - margin} ${width + margin * 2} ${height + margin * 2}`);
    }

    getNodes() {
        let nodes = [];
        function traverse(node) {
            if (node) {
                nodes.push(node);
                traverse(node.left);
                traverse(node.right);
            }
        }
        traverse(this.root);
        return nodes;
    }

    renderNode(svg, node) {
        if (node !== null) {
            // Draw the node as a circle
            svg.append("circle")
                .attr("cx", node.position.x)
                .attr("cy", node.position.y)
                .attr("r", this.nodeRadius)
                .attr("fill", "#4CAF50");

            // Draw the value inside the node
            svg.append("text")
                .attr("x", node.position.x)
                .attr("y", node.position.y)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .text(node.value);

            // Draw curved lines to children
            if (node.left !== null) {
                this.drawCurvedLine(svg, node, node.left);
                this.renderNode(svg, node.left);
            }

            if (node.right !== null) {
                this.drawCurvedLine(svg, node, node.right);
                this.renderNode(svg, node.right);
            }
        }
    }

    drawCurvedLine(svg, parent, child) {
        const midX = (parent.position.x + child.position.x) / 2;
        const midY = parent.position.y + 30;

        const pathData = `
            M ${parent.position.x} ${parent.position.y}
            Q ${midX} ${midY} ${child.position.x} ${child.position.y}
        `;

        svg.append("path")
            .attr("d", pathData)
            .attr("stroke", "#ccc")
            .attr("fill", "transparent")
            .attr("stroke-width", 2);
    }

    log(message) {
        console.log(`Logging message: ${message}`); // Debug log
        const consoleDiv = document.getElementById('console');
        if (consoleDiv) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = message;
            consoleDiv.appendChild(messageDiv);
            consoleDiv.scrollTop = consoleDiv.scrollHeight; // Scroll to the bottom
        } else {
            console.error('Console div not found');
        }
    }
}

const bst = new BST();

document.getElementById('submitBtn').addEventListener('click', function () {
    console.log('Submit button clicked');

    const action = document.getElementById('action').value;
    const value = parseInt(document.getElementById('nodeValue').value);

    if (isNaN(value)) {
        bst.log('Please enter a valid number');
        return;
    }

    switch (action) {
        case 'insert':
            bst.insert(value);
            break;
        case 'delete':
            bst.delete(value);
            break;
        case 'search':
            bst.search(value);
            break;
    }
    document.getElementById('nodeValue').value = ''; // Clear input after action
});


// Node types for skill building - each node type has specific function
export const NODE_TYPES = {
  ROOT: 'root',           // Root node: only skill metadata (name, author, description)
  FEATURE: 'feature',     // Features node: list all features
  USAGE: 'usage',         // Usage flow: step-by-step usage process
  COMMAND: 'command',     // Command: detailed command documentation
  PARAMETER: 'parameter', // Parameter: parameter definitions
  EXAMPLE: 'example',     // Example: usage examples with input/output
  NOTE: 'note',           // Note: remarks, notes, known issues
}

export const NODE_COLORS = {
  root: '#4CAF50',        // Root (green) - metadata
  feature: '#2196F3',     // Features (blue) - feature list
  usage: '#9C27B0',       // Usage (purple) - usage flow
  command: '#FF9800',     // Command (orange) - command docs
  parameter: '#F44336',   // Parameter (red) - parameter def
  example: '#00BCD4',     // Example (cyan) - usage examples
  note: '#607D8B',       // Note (gray-blue) - remarks
}

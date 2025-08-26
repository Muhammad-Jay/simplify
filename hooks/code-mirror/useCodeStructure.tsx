import React, { useMemo } from 'react';
import { syntaxTree } from '@codemirror/language';
import { EditorState } from '@codemirror/state'

const useCodeStructure = (editorState: any) => {
    const structure = useMemo(() => {
        if (!editorState){
            return {
                functions: [],
                variables: [],
                imports: [],
                exports: []
            }
        }

            const functions =  [];
            const variables =  [];
            const imports  = [];
            const exports  = [];

            const tree = syntaxTree(editorState);
            const sliceDoc = (from, to) => editorState.sliceDoc(from, to);

            tree.iterate({
                enter: (node) => {
                    switch (node.name) {
                        case 'FunctionDeclaration':
                            const funcNameNode = node.node.getChild('FunctionDefinition');
                            if (funcNameNode){
                                functions.push(sliceDoc(funcNameNode.from, funcNameNode.to));
                            }
                            break;
                        case 'VariableDeclaration':
                            const varNameNode = node.node.getChild('VariableDefinition');
                            if (varNameNode){
                                variables.push(sliceDoc(varNameNode.from, varNameNode.to));
                            }
                            break;
                        case 'import':
                            node.node.getChildren('ImportDefinition').forEach((specifier) => {
                                imports.push(sliceDoc(specifier.from, specifier.to));
                            })
                            break;
                        case 'export':
                            const exportNameNode = node.node.getChild('ExportDefinition');
                            if (exportNameNode){
                                exports.push(sliceDoc(exportNameNode.from, exportNameNode.to));
                            }
                            break;
                    }
                }
            });

            return {
                variables,
                functions,
                imports,
                exports
            }
    }, [editorState])

    return structure
}
export default useCodeStructure

import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import EmbeddingVis from "./components/EmbeddingVis";
import EmbeddingVisRow from "./components/EmbeddingVisRow";

import "./App.css";

function App() {
    const [words, setWords] = useState("");
    const [equationResults, setEquationResults] = useState([]);
    const [embeddings, setEmbeddings] = useState([]);

    useEffect(() => {
        const just_words = words
            .replace("+", ",")
            .replace("-", ",")
            .split(",")
            .map(m => m.trim())
            .join(",");

        fetch(
            `https://smooshr.stuartlynn.me/embedding/${just_words.toLowerCase()}`
        )
            .then(r => r.json())
            .then(r => {
                if (r.length > 0) {
                    setEmbeddings(
                        just_words
                            .split(",")
                            .map(word => r.find(res => res.key === word))
                            .filter(p => p)
                    );
                }
            });
    }, [words]);

    console.log("embeds ", embeddings);

    useEffect(() => {
        const equations = words.split(",").filter(s => s.match(/[+-]/));
        const embedLookup = embeddings.reduce(
            (r, e) => ({ ...r, [e.key]: e.embedding }),
            {}
        );
        console.log(equations);
        const eqnResults = equations
            .map(equation => {
                let reworkedEqn = equation;
                Object.keys(embedLookup).forEach(key => {
                    reworkedEqn = reworkedEqn.replace(
                        key,
                        `embedLookup[\'${key}\'][$i]`
                    );
                });
                let result = null;
                try {
                    result = Object.values(embedLookup)[0].map((v, i) =>
                        eval(reworkedEqn.replace(/\$i/g, i))
                    );
                    console.log("result ", result);
                } catch (err) {
                    console.log("not a real equation");
                }
                return { key: equation, embedding: result };
            })
            .filter(a => a.embedding);
        setEquationResults(eqnResults);
        // const result = Object.values[embedLookup][0].map((e, i) => eval());

        //        equations.map( (equation)=>{
        //        equation.
        //      })
    }, [embeddings]);

    return (
        <div className="App">
            <input value={words} onChange={e => setWords(e.target.value)} />
            <div
                className="embeddings"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                {embeddings.map(embedding => (
                    <EmbeddingVisRow
                        key={embedding.key}
                        embedding={embedding.embedding}
                        word={embedding.key}
                    />
                ))}
                {equationResults.map(emb => (
                    <EmbeddingVisRow
                        key={emb.key}
                        word={emb.key}
                        embedding={emb.embedding}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;

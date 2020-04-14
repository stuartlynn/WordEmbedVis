import React, { useRef } from "react";
import * as d3 from "d3";
import useComponentSize from "@rehooks/component-size";

export default function EmbeddingVisRow({ word, embedding, style }) {
    const scale = d3
        .scaleDiverging()
        .domain([-1, 0, 1])
        .interpolator(d3.interpolatePuOr);
    return (
        <div className="embedding-vis-row" style={style}>
            <h2>{word}</h2>
            <div
                style={{
                    border: "1px solid grey",
                    flex: 1,
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                {embedding.map(val => (
                    <div
                        className="element"
                        style={{
                            backgroundColor: scale(val),
                            flex: "grow",
                            height: "100%",
                            width: `${1000 / 300}px`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}

EmbeddingVisRow.defaultProps = {
    style: {
        width: "1000px",
        height: "200px",
        display: "flex",
        flexDirection: "column"
    }
};

import React, { useRef } from "react";
import { scaleLinear } from "d3-scale";
import useComponentSize from "@rehooks/component-size";

export default function EmbeddingVis({ word, embedding, style }) {
    let ref = useRef(null);
    let size = useComponentSize(ref);

    const x_coords = [...Array(embedding.length)].map((_, i) =>
        Math.cos((i * Math.PI * 2) / embedding.length)
    );
    const y_coords = [...Array(embedding.length)].map((_, i) =>
        Math.sin((i * Math.PI * 2) / embedding.length)
    );
    const base_radius = size.width / 3.0;
    const delta_radius_scale = 100;

    const path = embedding
        .map(
            (val, index) =>
                `${index == 0 ? "M" : "L"}${x_coords[index] *
                    (base_radius + val * delta_radius_scale)} ${y_coords[
                    index
                ] *
                    (base_radius + val * delta_radius_scale)}`
        )
        .join(" ");
    return (
        <div ref={ref} className="embedding-vis" style={style}>
            <h2>{word}</h2>
            <svg style={{ width: "100%", height: "100%" }}>
                <g
                    transform={`matrix(1 0 0 -1 ${size.width *
                        0.5} ${size.height * 0.5})`}
                >
                    <path d={path} />
                </g>
            </svg>
        </div>
    );
}

EmbeddingVis.defaultProps = {
    style: { width: "500px", height: "500px", border: "1px solid" },
    embedding: [...Array(300)].map(() => (Math.random() - 0.5) * 2)
};

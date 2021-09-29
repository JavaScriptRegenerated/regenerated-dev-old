<svg viewBox="0 0 180 80">
    <rect width="100%" height="100%" fill="black" />
    <g x="20" font-size="6" fill="white">
        <hero-icon name="solid/chat.svg" width="12" height="12" x="10" y="12"></hero-icon>
        <text x="30" y="20" fontFamily="var(--font-mono)">
            <tspan font-weight="bold">Send: </tspan>
            <tspan class-name="token keyword">yield</tspan>
            <tspan> </tspan>
            <tspan class-name="token string">"some string"</tspan>
        </text>

        <LoadedIcon
            name="solid/inbox-in.svg"
            width={12}
            height={12}
            x={10}
            y={32}
        />
        <text x="30" y="40" fontFamily="var(--font-mono)">
            <tspan font-weight="bold">Receive: </tspan>
            <tspan class-name="token keyword">const</tspan>
            <tspan> reply </tspan>
            <tspan class-name="token operator">=</tspan>
            <tspan> </tspan>
            <tspan class-name="token keyword">yield</tspan>
            <tspan> </tspan>
            <tspan class-name="token string">"string"</tspan>
        </text>

        <LoadedIcon
            name="solid/check-circle.svg"
            width={12}
            height={12}
            x={10}
            y={51}
        />
        <text x="30" y="60" fontFamily="var(--font-mono)">
            <tspan font-weight="bold">Result: </tspan>
            <tspan class-name="token keyword">return</tspan>
            <tspan> </tspan>
            <tspan class-name="token string">"final message"</tspan>
        </text>
    </g>
</svg>
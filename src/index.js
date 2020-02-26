import React from 'react';

const defaultProps = {
    className: "",
    strokeWidth: 5,
    size: 100,
    data: []
}

class SVGDonut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            processedData: [],
            raduis: 0,
            strokeDasharray: 0,
            cxcy: 0,
            selectedDonut: null
        }
    }

    componentDidMount() {
        const { size, strokeWidth, data } = this.props;
        const raduis = size / 2 - strokeWidth;
        let processedData = [];
        data.map((item, index) => {
            const prevItem = processedData[index - 1];
            return processedData.push({
                ...item,
                startFrom: prevItem ? (prevItem.startFrom + prevItem.value) : 0
            })
        })
        this.setState({
            processedData,
            raduis,
            strokeDasharray: Math.PI * (raduis * 2),
            cxcy: size / 2
        })
    }

    renderArch = (item, index, prevItem = null) => {
        const { strokeWidth, size } = this.props;
        const { raduis, cxcy, selectedDonut, strokeDasharray } = this.state;

        const rotateValue = prevItem ? prevItem.value * 3.6 : 0;
        const startFromValue = prevItem ? prevItem.startFrom * 3.6 : 0;

        const degree = item.value * 3.6;
        const x = cxcy + ((cxcy - strokeWidth) * Math.cos((degree - (strokeWidth / 2)) * Math.PI / 180));
        const y = cxcy + ((cxcy - strokeWidth) * Math.sin((degree - (strokeWidth / 2)) * Math.PI / 180));
        const pathValue = `M ${size - strokeWidth} ${cxcy} A ${cxcy - strokeWidth} ${cxcy - strokeWidth} 0 ${degree > 180 ? 1 : 0} 1 ${x} ${y}`;

        return degree > 359 ? <circle
            key={index}
            r={raduis}
            cx={cxcy}
            cy={cxcy}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            className="bg-circle"
            stroke="#ddd"
        /> : <path
                key={index}
                strokeWidth={selectedDonut && selectedDonut.color === item.color ? strokeWidth + 2 : strokeWidth}
                fill="transparent"
                stroke={item.color}
                transform={`rotate(${rotateValue + startFromValue} ${cxcy} ${cxcy})`}
                style={{ transition: 'all 0.1s ease-in-out', cursor: 'pointer' }}
                onMouseOver={() => this.setState({
                    selectedDonut: item
                })}
                d={pathValue} />
    }

    render() {
        const { className } = this.props;
        const { processedData, selectedDonut } = this.state;

        return (
            <div className={`donut-graph ${className}`}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    {this.renderArch({ color: '#ddd', value: 360 }, 0, null)}
                    {processedData.map((item, index) => this.renderArch(item, index, processedData[index - 1]))}
                    {selectedDonut ? <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill={selectedDonut.color}>{selectedDonut.value}</text> : null}
                </svg>
            </div>
        );
    }
}

SVGDonut.defaultProps = defaultProps;

export default SVGDonut;
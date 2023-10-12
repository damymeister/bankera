import { IconType } from 'react-icons';
import './css/service.css';

interface Service {
    name: string,
    icon: React.JSX.Element,
    //description: string
}

export default function Service(props: { service: Service }) {
    return (
        <div className="service">
            <h2>{props.service.icon} {props.service.name}</h2>
            {/* <p>{props.service.description}</p> */}
        </div>
    );
}
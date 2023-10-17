import {
    IonItem,
    IonLabel,
    IonList,
    IonSkeletonText,
    IonThumbnail
} from "@ionic/react";
import './MySkeleton.css';

const MySkeleton = () => {
    return(
        <div className={`custom-skeleton`}>
            <IonList className={`custom-skeleton-list`}>
                <IonItem lines={`none`} className={`custom-skeleton-item`}>
                    <IonThumbnail slot="start">
                        <IonSkeletonText animated={true}></IonSkeletonText>
                    </IonThumbnail>
                    <IonLabel>
                        <h3>
                            <IonSkeletonText animated={true} style={{ 'width': '100%' }}></IonSkeletonText>
                        </h3>
                        <p>
                            <IonSkeletonText animated={true} style={{ 'width': '80%' }}></IonSkeletonText>
                        </p>
                        <p>
                            <IonSkeletonText animated={true} style={{ 'width': '60%' }}></IonSkeletonText>
                        </p>
                    </IonLabel>
                </IonItem>
            </IonList>
        </div>
    );
}

export default MySkeleton;
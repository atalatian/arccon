import {IonAccordion, IonAccordionGroup, IonIcon, IonItem, IonLabel, IonList, IonListHeader} from "@ionic/react";
import {Box} from "@mui/system";
import React, {useContext, useEffect, useRef, useState} from "react";
import department from "../pages/Department";
import {RouteComponentProps} from "react-router";
import {DepAdContext} from "../context/DepAdContext";
import {business, person} from "ionicons/icons";

interface Admin {
    id: number,
    name: string,
}

interface Department {
    id: number,
    name: string,
    admins: Admin[] | [],
}

const data: Department[] = [
    {
        id: 0,
        name: `Geotechnik`,
        admins: [
            {
                id: 0,
                name: `admin 1`,
            },
            {
                id: 1,
                name: `admin 2`,
            },
            {
                id: 2,
                name: `admin 3`,
            },
        ]
    },
    {
        id: 1,
        name: `Bergbau`,
        admins: [
            {
                id: 0,
                name: `admin 1`,
            },
            {
                id: 1,
                name: `admin 2`,
            },
            {
                id: 2,
                name: `admin 3`,
            },
        ],
    },
    {
        id: 2,
        name: `Umwelt`,
        admins: [
            {
                id: 0,
                name: `admin 1`,
            },
            {
                id: 1,
                name: `admin 2`,
            },
            {
                id: 2,
                name: `admin 3`,
            },
        ]
    },
]

interface Props extends RouteComponentProps{
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
}

const DepartmentsAccordionGroup = (props: Props) => {
    const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
    const ctx = useContext(DepAdContext);

    useEffect(() => {
        if (!accordionGroup.current) {
            return;
        }

        //accordionGroup.current.value = data.map((department) => department.id.toString());
    }, []);

    const handleClick = (dep: number, ad: number) => {
        return (ev: React.MouseEvent<HTMLIonItemElement, MouseEvent>): void => {
            props.setIsOpen(false);
            ctx?.setDepartmentId(dep);
            ctx?.setAdminId(ad);
            localStorage.setItem('departmentId', dep.toString());
            localStorage.setItem('adminId', ad.toString());
            props.history.push(`/project/list`, 'fromModal');
        }
    }

    return(
        <IonAccordionGroup className={`custom-accordion-group`} ref={accordionGroup} multiple={true}>
            <IonListHeader className={`custom-list-header`}>
                <Box mb={1}>
                    <h1>Departments</h1>
                </Box>
            </IonListHeader>
            {
                data.map((department)=>
                    <IonAccordion className={`custom-accordion`} key={department.id} value={`${department.id}`}>
                        <IonItem className={`custom-item`} slot={`header`} color={`medium`}>
                            <IonIcon slot={`start`} icon={business}/>
                            <IonLabel><h1>{department.name}</h1></IonLabel>
                        </IonItem>
                        <Box slot={`content`} sx={{ pr: 0, bgcolor: `rgba(255, 255, 255, 0.5)`, }}>
                            <IonList style={{ background: `transparent` }}>
                                <IonListHeader>
                                    <h2>Admins</h2>
                                </IonListHeader>
                                {
                                    department.admins.map((admin, index)=>
                                        <IonItem className={`custom-admin-item`} key={admin.id} color={`transparent`} button detail onClick={handleClick(department.id, admin.id)}
                                                 lines={department.admins.length === index + 1 ? 'none' : undefined}>
                                            <IonIcon slot={`start`} icon={person}/>
                                            <IonLabel>
                                                {admin.name}
                                            </IonLabel>
                                        </IonItem>
                                    )
                                }
                            </IonList>
                        </Box>
                    </IonAccordion>
                )
            }
        </IonAccordionGroup>
    );
}

export default DepartmentsAccordionGroup;
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';

interface Artwork {
    id: string;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

export default function Table() {
    const [artWorkData, setArtWorkData] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [selectedRowsMap, setSelectedRowsMap] = useState<{ [key: number]: Artwork[] }>({});
    const [value1, setValue1] = useState<number | null>(null);


    const op = useRef<any>(null);


    const fetchArtworks = async (page: number) => {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${60}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`);
        const data = await response.json();
        return data;
    };


    const onPage = async (event: any) => {
        const page = event.page + 1;
        setFirst(event.first);
        const data = await fetchArtworks(page);
        setArtWorkData(data.data);
        setTotalRecords(data.pagination.total);
    };


    const onRowSelect = (e: any) => {
        setSelectedRowsMap((prev) => ({
            ...prev,
            [first]: e.value
        }));
    };


    const handleSubmit = () => {
        if (value1 !== null) {
            const selectedRows = artWorkData.slice(0, value1);
            setSelectedRowsMap((prev) => ({
                ...prev,
                [first]: selectedRows
            }));
        }
        op.current.hide();
    };

    const titleHeader = (
        <span>
            <i className="material-icons" style={{ verticalAlign: 'middle', cursor: 'pointer' }} onClick={(e) => op.current.toggle(e)}>keyboard_arrow_down</i>
            <span style={{ marginLeft: '8px' }}>Title</span>
            <OverlayPanel ref={op}>
                <div style={{ width: '210px' }}>
                    <InputNumber inputId="integeronly" value={value1} onValueChange={(e: InputNumberValueChangeEvent) => setValue1(e.value)} />
                    <Button label="Submit" style={{ marginTop: '10px' }} onClick={handleSubmit} />
                </div>
            </OverlayPanel>
        </span>
    );


    useEffect(() => {
        fetchArtworks(1).then(data => {
            setArtWorkData(data.data);
            setTotalRecords(data.pagination.total);
        });
    }, []);

    return (
        <div className="card">
            <DataTable value={artWorkData}
                selectionMode={'multiple'}
                selection={selectedRowsMap[first] || []}
                onSelectionChange={onRowSelect}
                dataKey="id"
                paginator
                first={first}
                rows={10}
                onPage={onPage}
                totalRecords={totalRecords}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="title" header={titleHeader}></Column>
                <Column field="place_of_origin" header="Origin"></Column>
                <Column field="artist_display" header="Artist"></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Start Date"></Column>
                <Column field="date_end" header="End Date"></Column>
            </DataTable>
        </div>
    );
}




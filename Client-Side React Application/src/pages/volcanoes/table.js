import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const Table = ({ SearchValues }) => {
    const gridRef = useRef();
    const navigate = useNavigate();
    const [volcanoes, setVolcanoes] = useState(SearchValues.volcanoes);

    const columnDefs = useMemo(
        () => [
            { headerName: 'No', field: 'id', minWidth: 100, flex: 1 },
            { headerName: 'Name', field: 'name', flex: 2 },
            { headerName: 'Country', field: 'country', flex: 2 },
            { headerName: 'Region', field: 'region', flex: 3 },
            { headerName: 'Subregion', field: 'subregion', flex: 3 }
        ],
        []
    );

    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            suppressMovable: true,
            resizable: false
        };
    }, []);

    useEffect(() => {
        let filter = SearchValues.search;
        let data = SearchValues.volcanoes;
        setVolcanoes(
            data.filter((volcano) => {
                return volcano.name.toLowerCase().includes(filter.toLowerCase()) ||
                    volcano.country.toLowerCase().includes(filter.toLowerCase()) ||
                    volcano.region.toLowerCase().includes(filter.toLowerCase()) ||
                    volcano.subregion.toLowerCase().includes(filter.toLowerCase());
            })
        );
    }, [SearchValues]);

    const onRowClicked = (event) => {
        navigate(`/volcano?id=${event.data.id}`);
    };

    return (
        <AgGridReact
            className="mt-3 ag-theme-quartz w-[63rem]"
            ref={gridRef}
            rowData={volcanoes}

            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            domLayout='autoHeight'

            onRowClicked={onRowClicked}
            getRowStyle={() => ({ cursor: 'pointer' })}

            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50, 100]}
        />
    );
};

export default Table;
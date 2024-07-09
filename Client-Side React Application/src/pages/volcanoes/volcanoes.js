import React from 'react';
import { useState } from 'react';

import Search from './search';
import Table from './table';

const Volcanoes = () => {
    const [search, setSearch] = useState({ country: '--', populatedWithin: '--', search: '', volcanoes: [] });

    return (
        <div className="pt-24 pb-4 flex flex-col items-center justify-evenly flex-10a">
            <div className="flex flex-col items-center w-full min-w-[32rem]">
                <span after="SEARCH" className="highlighted-heading text-7xl text-center">
                    SEARCH
                </span>

                <Search SearchValues={setSearch} />

                <Table SearchValues={search}/>
            </div>
        </div>
    );
}

export default Volcanoes;
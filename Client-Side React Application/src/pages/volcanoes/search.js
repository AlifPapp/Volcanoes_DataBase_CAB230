import React, { useState, useEffect } from 'react';

import { GetBaseEndpoint } from '../../utils/BaseEndpoint';

const Search = ({ SearchValues }) => {
    const baseEndpoint = GetBaseEndpoint();

    const [countries, setCountries] = useState([]);
    const populatedWithin = ['5km', '10km', '30km', '100km'];

    const [search, setSearch] = useState({ country: '--', populatedWithin: '--' });
    const [searchBox, setSearchBox] = useState('');
    const [volcanoes, setVolcanoes] = useState([]);

    useEffect(() => { onload() }, []);
    async function onload() {
        let response = await fetch(baseEndpoint + '/countries');
        if (response.status === 200) {
            let data = await response.json();
            setCountries(data);

            const urlParams = new URLSearchParams(window.location.search);
            let countryParam = urlParams.get('country');
            let populatedWithinParam = urlParams.get('populatedWithin');
            let searchParam = urlParams.get('search');

            if (countryParam === null || !data.includes(countryParam)) {
                countryParam = '--';
            }
            if (populatedWithinParam === null || !populatedWithin.includes(populatedWithinParam)) {
                populatedWithinParam = '--';
            }
            if (searchParam === null) {
                searchParam = '';
            }

            setSearch({ country: countryParam, populatedWithin: populatedWithinParam, search: searchParam });
        }
    }

    useEffect(() => {
        if (countries.length === 0) return;
        fetchVolcanoes()
    }, [search]);

    async function fetchVolcanoes() {
        var data = [];

        if (search.country !== '--') {
            let fetchURL = baseEndpoint + '/volcanoes?country=' + search.country.replace(' ', '%20');
            if (search.populatedWithin !== '--') {
                fetchURL += '&populatedWithin=' + search.populatedWithin;
            }

            let response = await fetch(fetchURL);
            if (response.status === 200) {
                data = await response.json();
            }
        }

        updateURLParams();
        setVolcanoes(data);
        SearchValues({ country: search.country, populatedWithin: search.populatedWithin, search: searchBox, volcanoes: data });
    }

    useEffect(() => {
        if (countries.length === 0) return;
        updateURLParams();
        SearchValues({ country: search.country, populatedWithin: search.populatedWithin, search: searchBox, volcanoes: volcanoes });
    }, [searchBox]);

    function updateURLParams() {
        let url = window.location.origin + window.location.pathname;
        let params = new URLSearchParams();
        if (search.country !== '--') {
            params.append('country', search.country);
        }
        if (search.populatedWithin !== '--') {
            params.append('populatedWithin', search.populatedWithin);
        }
        if (searchBox !== '') {
            params.append('search', searchBox);
        }

        if (params.toString() === '') {
            window.history.pushState({}, '', url);
            return;
        } else {
            window.history.pushState({}, '', url + '?' + params.toString());
        }
    }

    return (
        <div className="flex flex-col sm:grid sm:grid-cols-2">
            <span className="font-bold text-3xl">
                Country:
            </span>
            <select
                className="mt-3 input-box text-center font-bold"
                value={search.country}
                onChange={(e) => setSearch({ country: e.target.value, populatedWithin: search.populatedWithin })}>
                <option value="--">--</option>
                {countries.map((value, index) => { return <option key={index} value={value}>{value}</option> })}
            </select>

            <span className="font-bold text-3xl">
                Populated Within:
            </span>
            <select
                className="mt-3 input-box text-center font-bold"
                value={search.populatedWithin}
                onChange={(e) => setSearch({ country: search.country, populatedWithin: e.target.value })}>
                <option value="--">--</option>
                {populatedWithin.map((value, index) => { return <option key={index} value={value}>{value}</option> })}
            </select>

            <input className="mt-3 sm:grid-rows-subgrid sm:col-span-2 w-full input-box text-center font-bold "
                type="text"
                placeholder="Search"
                value={searchBox}
                onChange={(e) => setSearchBox(e.target.value)}
            />
        </div>
    );
};

export default Search;
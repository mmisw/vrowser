module.exports = {

    voc: {
        uri:     'http://mmisw.org/ont/cf/parameter',
        prefix:  'http://mmisw.org/ont/cf/parameter/'
    },

    termList: {
        fields: [{
            name: 'name'
        }, {
            name: 'definition'
        }, {
            name: 'canonicalUnits'
        }]
    },

    orr: {
        name:           'MMI ORR',
        website:        'http://mmisw.org/',
        sparqlEndpoint: 'http://mmisw.org/sparql',

        generalInfoQuery:
            "prefix omvmmi: <http://mmisw.org/ont/mmi/20081020/ontologyMetadata/>\n" +
            "prefix omv: <http://omv.ontoware.org/2005/05/ontology#>\n" +
            "select distinct ?name ?version\n" +
            "where {\n" +
            "  OPTIONAL { <{{voc.uri}}> omv:name      ?name}\n" +
            "  OPTIONAL { <{{voc.uri}}> omv:version   ?version}\n" +
            "}",

        termListQuery:
            "prefix vocb: <{{voc.prefix}}>\n" +
            "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
            "select distinct ?name ?definition ?canonicalUnits\n" +
            "where {\n" +
            "  vocb:parameter skos:narrower ?name.\n" +
            "  OPTIONAL { ?name skos:definition      ?definition }\n" +
            "  OPTIONAL { ?name vocb:canonical_units ?canonicalUnits }\n" +
            "} order by ?name",

        termQueryTemplate:
            "prefix vocb: <{{voc.prefix}}>\n" +
            "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
            "select distinct ?definition ?canonicalUnits where {\n" +
            "  vocb:parameter skos:narrower {{name}}.\n" +
            "  OPTIONAL { {{name}} skos:definition      ?definition }\n" +
            "  OPTIONAL { {{name}} vocb:canonical_units ?canonicalUnits }\n" +
            "}"
    },

    // according to http://cfconventions.org/Data/cf-standard-names/27/build/cf-standard-name-table.html as of 2014-07-25
    categories: [{
        label:        'Atmospheric Chemistry',
        searchString: 'aerosol dry.*deposition wet.*deposition production emission mole'
    }, {
        label:        'Atmospheric Dynamics',
        searchString: 'air_pressure atmosphere.*vorticity atmosphere.*streamfunction wind momentum.*in_air gravity_wave ertel geopotential omega atmosphere.*dissipation atmosphere.*energy atmosphere.*drag atmosphere.*stress surface.*stress'
    }, {
        label:        'Carbon Cycle',
        searchString: 'carbon leaf vegetation'
    }, {
        label:        'Cloud',
        searchString: 'cloud'
    }, {
        label:        'Hydrology',
        searchString: 'atmosphere_water canopy_water precipitation rain snow moisture freshwater runoff root humidity transpiration evaporation water_vapour river'
    }, {
        label:        'Ocean Dynamics',
        searchString: 'ocean.*streamfunction sea_water_velocity ocean.*vorticity'
    }, {
        label:        'Radiation',
        searchString: 'radiative longwave shortwave brightness radiance albedo'
    }, {
        label:        'Sea Ice',
        searchString: 'sea_ice'
    }, {
        label:        'Surface',
        searchString: 'surface'
    }],

    mapping: {
        /*
         * Note: we do UNIONs below to not necessarily rely on inference
         * being enabled on the SPARQL endpoint.
         */
        predicates: [{
            label:          'skos:exactMatch',
            predicate:      'http://www.w3.org/2004/02/skos/core#exactMatch',
            queryTemplate:
                "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                "select distinct ?object where {\n" +
                " { {{termUri}} skos:exactMatch ?object     } UNION\n" +
                " { ?object     skos:exactMatch {{termUri}} } \n" +
                "} order by ?object"
        }, {
            label:          'skos:broadMatch',
            predicate:      'http://www.w3.org/2004/02/skos/core#broadMatch',
            queryTemplate:
                "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                "select distinct ?object where {\n" +
                " { {{termUri}} skos:broadMatch  ?object     } UNION\n" +
                " { ?object     skos:narrowMatch {{termUri}} }\n" +
                "} order by ?object"
        }, {
            label:          'skos:narrowMatch',
            predicate:      'http://www.w3.org/2004/02/skos/core#narrowMatch',
            queryTemplate:
                "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                "select distinct ?object where {\n" +
                " { {{termUri}} skos:narrowMatch ?object     } UNION \n" +
                " { ?object     skos:broadMatch  {{termUri}} }\n" +
                "} order by ?object"
        }, {
            label:        'skos:relatedMatch',
            predicate:      'http://www.w3.org/2004/02/skos/core#relatedMatch',
            queryTemplate:
                "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                "select distinct ?object where {\n" +
                " { {{termUri}} skos:relatedMatch ?object     } UNION \n" +
                " { ?object     skos:relatedMatch {{termUri}} }\n" +
                "} order by ?object"
        }, {
            label:          'skos:narrower',
            predicate:      'http://www.w3.org/2004/02/skos/core#narrower',
            queryTemplate:
                "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                "select distinct ?object where {\n" +
                " { {{termUri}} skos:narrower ?object     } UNION \n" +
                " { ?object     skos:broader  {{termUri}} }\n" +
                "} order by ?object"
        }, {
            label:          'skos:broader',
            predicate:      'http://www.w3.org/2004/02/skos/core#broader',
            queryTemplate:
                "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                "select distinct ?object where {\n" +
                " { {{termUri}} skos:broader ?object     } UNION \n" +
                " { ?object     skos:narrower  {{termUri}} }\n" +
                "} order by ?object"
        }, {
            label:          'skos:related',
            predicate:      'http://www.w3.org/2004/02/skos/core#related',
            queryTemplate:
                "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
                "select distinct ?object where {\n" +
                " { {{termUri}} skos:related ?object     } UNION \n" +
                " { ?object     skos:related  {{termUri}} }\n" +
                "} order by ?object"
        }, {
            label:          'owl:sameAs',
            predicate:      'http://www.w3.org/2002/07/owl#sameAs',
            queryTemplate:
                "prefix owl: <http://www.w3.org/2002/07/owl#>\n" +
                "select distinct ?object where {\n" +
                " { {{termUri}} owl:sameAs ?object     } UNION \n" +
                " { ?object     owl:sameAs  {{termUri}} }\n" +
                "} order by ?object"
        }]
    }

};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Demo_modules_css_1 = __importDefault(require("./Demo.modules.css"));
const material_1 = require("@mui/material");
const react_1 = require("react");
const Editors_1 = require("../Editors/Editors");
const helperFunctions_1 = require("../helperFunctions");
const ForwardRounded_1 = __importDefault(require("@mui/icons-material/ForwardRounded"));
const Graph_1 = require("../Graph/Graph");
const HitMiss_1 = require("../HitMiss/HitMiss");
const Alert_1 = require("../Alert/Alert");
const Quellify_1 = require("../../quell-client/src/Quellify");
const styles_1 = require("@mui/material/styles");
const Visualizer_1 = require("../Visualizer/Visualizer");
// import { getElapsedTime } from '../../../../server/schema/schema';
const Demo = (0, react_1.memo)(() => {
    const [responseTimes, addResponseTimes] = (0, react_1.useState)([]);
    const [errorAlerts, addErrorAlerts] = (0, react_1.useState)([]);
    const [selectedQuery, setQueryChoice] = (0, react_1.useState)("2depth");
    const [query, setQuery] = (0, react_1.useState)(helperFunctions_1.querySamples[selectedQuery]);
    const [queryTypes, addQueryTypes] = (0, react_1.useState)([]);
    const [maxDepth, setDepth] = (0, react_1.useState)(15);
    const [maxCost, setCost] = (0, react_1.useState)(6000);
    const [ipRate, setIPRate] = (0, react_1.useState)(22);
    const [isToggled, setIsToggled] = (0, react_1.useState)(false);
    const [cacheHit, setCacheHit] = (0, react_1.useState)(0);
    const [cacheMiss, setCacheMiss] = (0, react_1.useState)(0);
    const [elapsed, setElapsed] = (0, react_1.useState)({});
    // Hook for visualizer toggled
    const [isVisualizer, setIsVisualizer] = (0, react_1.useState)(false);
    const [visualizerQuery, setVisualizerQuery] = (0, react_1.useState)(query);
    (0, react_1.useEffect)(() => { }, [errorAlerts, responseTimes]);
    function handleToggle(event) {
        // Removed client cache clear on toggle, but kept on 'Clear Client Cache' button click.
        // Clear both cache on the toggle event
        // clearLokiCache();
        // fetch('/api/clearCache').then((res) =>
        //   console.log('Cleared Server Cache!')
        // );
        setIsToggled(event.target.checked);
    }
    // Function to handle visualizer toggle
    function handleVisualizerToggle(event) {
        setIsVisualizer(event.target.checked);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { id: "demo", className: "container bg-darkblue flex flex-col px-6 py-8 mx-auto pt-10 rounded-lg content-start space-y-0", children: [(0, jsx_runtime_1.jsxs)("div", { id: Demo_modules_css_1.default.demoHeader, className: "scrollpoint", children: [(0, jsx_runtime_1.jsx)("div", { id: "scroll-demo" }), (0, jsx_runtime_1.jsx)("h1", { id: Demo_modules_css_1.default.header, children: "Demo" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { className: "text-white font-sans", label: "Server-side caching", control: (0, jsx_runtime_1.jsx)(material_1.Switch, { checked: isToggled, onChange: handleToggle }) }), (0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { className: "text-white font-sans", label: "Visualizer", control: (0, jsx_runtime_1.jsx)(material_1.Switch, { checked: isVisualizer, onChange: handleVisualizerToggle }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col pt-9 gap-10 xl:flex-row", children: [(0, jsx_runtime_1.jsx)("div", { className: "leftContainer flex-1 flex-shrink", children: (0, jsx_runtime_1.jsx)(QueryDemo, { maxDepth: maxDepth, maxCost: maxCost, ipRate: ipRate, addErrorAlerts: addErrorAlerts, responseTimes: responseTimes, addResponseTimes: addResponseTimes, selectedQuery: selectedQuery, setQueryChoice: setQueryChoice, query: query, setQuery: setQuery, queryTypes: queryTypes, addQueryTypes: addQueryTypes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss, isToggled: isToggled, setVisualizerQuery: setVisualizerQuery, visualizerQuery: visualizerQuery, setElapsed: setElapsed, elapsed: elapsed }) }), (0, jsx_runtime_1.jsx)(material_1.Divider, { sx: { zIndex: "50" }, flexItem: true, orientation: "vertical" }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex-grow overflow-x-auto", children: isVisualizer ? ((0, jsx_runtime_1.jsx)(Visualizer_1.Visualizer, { query: visualizerQuery, elapsed: elapsed })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(CacheControls, { setDepth: setDepth, setCost: setCost, setIPRate: setIPRate, addResponseTimes: addResponseTimes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss, isToggled: isToggled }), (0, jsx_runtime_1.jsx)(material_1.Divider, { className: "p-1", orientation: "horizontal" }), (0, jsx_runtime_1.jsx)(Graph_1.Graph, { responseTimes: responseTimes, selectedQuery: selectedQuery, queryTypes: queryTypes }), (0, jsx_runtime_1.jsx)(HitMiss_1.HitMiss, { cacheHit: cacheHit, cacheMiss: cacheMiss })] })) }), (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [responseTimes.map((el, i) => {
                                return (0, jsx_runtime_1.jsx)(Alert_1.SuccessfulQuery, {}, i);
                            }), errorAlerts.map((el, i) => {
                                console.log("ERROR: ", el);
                                return (0, jsx_runtime_1.jsx)(Alert_1.BadQuery, { errorMessage: el }, i);
                            })] })] })] }));
});
function QueryDemo({ addErrorAlerts, responseTimes, addResponseTimes, maxDepth, maxCost, ipRate, selectedQuery, setQueryChoice, query, setQuery, queryTypes, addQueryTypes, cacheHit, cacheMiss, setCacheHit, setCacheMiss, isToggled, visualizerQuery, setVisualizerQuery, setElapsed, elapsed, }) {
    const [response, setResponse] = (0, react_1.useState)("");
    function submitClientQuery() {
        const startTime = new Date().getTime();
        fetch("/api/clearCache").then((res) => console.log("Cleared Server Cache!"));
        (0, Quellify_1.Quellify)("/api/graphql", query, { maxDepth, maxCost, ipRate })
            .then((res) => {
            setVisualizerQuery(query);
            const responseTime = new Date().getTime() - startTime;
            addResponseTimes([...responseTimes, responseTime]);
            const queryType = selectedQuery;
            addQueryTypes([...queryTypes, queryType]);
            if (Array.isArray(res)) {
                let responseObj = res[0];
                // remove "$loki" property from cached response
                if (responseObj.hasOwnProperty("$loki")) {
                    delete responseObj["$loki"];
                }
                let cachedResponse = JSON.stringify(responseObj, null, 2);
                setResponse(cachedResponse);
                if (res[1] === false) {
                    setCacheMiss(cacheMiss + 1);
                }
                else if (res[1] === true) {
                    setCacheHit(cacheHit + 1);
                }
            }
        })
            .then(() => {
            fetch("/api/queryTime")
                .then((res) => res.json())
                .then((time) => {
                if (setElapsed) {
                    setElapsed(time.time);
                }
            });
        })
            .catch((err) => {
            const error = {
                log: "Error when trying to fetch to GraphQL endpoint",
                status: 400,
                message: {
                    err: `Error in submitClientQuery. ${err}`,
                },
            };
            console.log("Error in fetch: ", error);
            err = "Invalid query";
            addErrorAlerts((prev) => [...prev, err]);
        });
    }
    function submitServerQuery() {
        const startTime = new Date().getTime();
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: query,
                costOptions: { maxDepth, maxCost, ipRate },
            }),
        };
        let resError;
        fetch("/api/graphql", fetchOptions)
            .then((res) => res.json())
            .then((res) => {
            setVisualizerQuery(query);
            resError = res;
            const responseTime = new Date().getTime() - startTime;
            addResponseTimes([...responseTimes, responseTime]);
            setResponse(JSON.stringify(res.queryResponse.data, null, 2));
            if (res.queryResponse.cached === true)
                setCacheHit(cacheHit + 1);
            else
                setCacheMiss(cacheMiss + 1);
        })
            .then(() => {
            fetch("/api/queryTime")
                .then((res) => res.json())
                .then((time) => {
                if (setElapsed) {
                    setElapsed(time.time);
                }
            });
        })
            .catch((err) => {
            const error = {
                log: "Error when trying to fetch to GraphQL endpoint",
                status: 400,
                message: {
                    err: `Error in submitClientQuery. ${err}`,
                },
            };
            console.log("Error in fetch: ", error);
            err = resError;
            addErrorAlerts((prev) => [...prev, err]);
        });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { spellCheck: "false", children: [(0, jsx_runtime_1.jsx)(DemoControls, { selectedQuery: selectedQuery, setQueryChoice: setQueryChoice, submitQuery: isToggled ? submitServerQuery : submitClientQuery }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Editors_1.QueryEditor, { selectedQuery: selectedQuery, setQuery: setQuery }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white text-center", children: "See your query results: " }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-30 border-1 border-white p-5", children: (0, jsx_runtime_1.jsx)(material_1.TextField, { id: Demo_modules_css_1.default.queryText, multiline: true, fullWidth: true, InputProps: { className: Demo_modules_css_1.default.queryInput }, rows: "20", value: response }) })] }));
}
const DemoControls = ({ selectedQuery, setQueryChoice, submitQuery, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-w-full flex flex-col gap-5 text-white items-center", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Select a query to test: " }), (0, jsx_runtime_1.jsx)(QuerySelect, { setQueryChoice: setQueryChoice, selectedQuery: selectedQuery }), (0, jsx_runtime_1.jsx)(material_1.Button, { endIcon: (0, jsx_runtime_1.jsx)(ForwardRounded_1.default, {}), id: Demo_modules_css_1.default.submitQuery, onClick: () => submitQuery(), size: "small", color: "secondary", variant: "contained", children: "Query" })] }));
};
const CacheControls = ({ setDepth, setCost, setIPRate, addResponseTimes, setCacheHit, setCacheMiss, cacheHit, cacheMiss, isToggled, }) => {
    function resetGraph() {
        addResponseTimes([]);
        (0, Quellify_1.clearCache)();
        isToggled ? clearServerCache() : clearClientCache();
        setCacheHit((cacheHit = 0));
        setCacheMiss((cacheMiss = 0));
    }
    const clearClientCache = () => {
        return (0, Quellify_1.clearCache)();
    };
    const clearServerCache = () => {
        fetch("/api/clearCache").then((res) => console.log("Cleared Server Cache!"));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: Demo_modules_css_1.default.cacheControls, children: [(0, jsx_runtime_1.jsxs)(material_1.Stack, { direction: "row", alignItems: "center", justifyContent: "center", spacing: 2, children: [(0, jsx_runtime_1.jsxs)(material_1.Button, { className: Demo_modules_css_1.default.button, onClick: isToggled ? clearServerCache : clearClientCache, size: "small", color: "secondary", variant: "contained", children: ["Clear ", isToggled ? "Server" : "Client", " Cache"] }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: resetGraph, className: Demo_modules_css_1.default.button, size: "small", color: "secondary", variant: "contained", children: "Reset Graph" })] }), isToggled ? ((0, jsx_runtime_1.jsx)("div", { style: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }, children: (0, jsx_runtime_1.jsx)(Limit, { setDepth: setDepth, setCost: setCost, setIPRate: setIPRate, addResponseTimes: addResponseTimes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss }) })) : ((0, jsx_runtime_1.jsx)(material_1.Stack, { direction: "row", alignItems: "center", justifyContent: "space-around", spacing: 1 }))] }));
};
//Query Dropdown Menu
function QuerySelect({ setQueryChoice, selectedQuery }) {
    const handleChange = (event) => {
        //this state is controlled by the demoControls aka the parent component
        setQueryChoice(event.target.value);
    };
    return ((0, jsx_runtime_1.jsx)(material_1.Box, { className: "text-center min-w-[90%]", children: (0, jsx_runtime_1.jsxs)(material_1.FormControl, { fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "demo-simple-select-label", style: { color: "white", borderStyle: "white" }, children: "Query" }), (0, jsx_runtime_1.jsxs)(material_1.Select, { style: { color: "white" }, labelId: "demo-simple-select-label", value: selectedQuery, defaultValue: selectedQuery, label: "Query", onChange: handleChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { style: { color: "white" }, value: "2depth", children: "2-Depth" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { style: { color: "white" }, value: "3depth", children: "3-Depth Country and Cities" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { style: { color: "white" }, value: "costly", children: "Costly" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { style: { color: "white" }, value: "nested", children: "Nested" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { style: { color: "white" }, value: "fragment", children: "Fragment" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { style: { color: "white" }, value: "mutation", children: "Mutation" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { style: { color: "white" }, value: "countryMut", children: "Mutation Country" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { style: { color: "white" }, value: "delete", children: "Mutation Delete City" })] })] }) }));
}
const StyledDiv = (0, styles_1.styled)("div")(({ theme }) => (Object.assign(Object.assign({}, theme.typography.button), { backgroundColor: theme.palette.primary.main, borderRadius: "5px", fontSmooth: "always", color: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" })));
function Limit({ setDepth, setCost, setIPRate }) {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(StyledDiv, { className: Demo_modules_css_1.default.limits, children: (0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Max Depth: " }), (0, jsx_runtime_1.jsx)("input", { className: Demo_modules_css_1.default.limitsInput, type: "number", placeholder: "15", onChange: (e) => {
                                setDepth(Number(e.target.value));
                            } })] }) }), (0, jsx_runtime_1.jsx)(StyledDiv, { className: Demo_modules_css_1.default.limits, children: (0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Max Cost: " }), (0, jsx_runtime_1.jsx)("input", { className: Demo_modules_css_1.default.limitsInput, type: "number", placeholder: "6000", onChange: (e) => {
                                setCost(Number(e.target.value));
                            } })] }) }), (0, jsx_runtime_1.jsx)(StyledDiv, { className: Demo_modules_css_1.default.limits, children: (0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Requests /s: " }), (0, jsx_runtime_1.jsx)("input", { className: Demo_modules_css_1.default.limitsInput, type: "number", placeholder: "22", onChange: (e) => {
                                setIPRate(+Number(e.target.value));
                            } })] }) })] }));
}
exports.default = Demo;

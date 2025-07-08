import { useEffect, useState } from "react";
import CatalogItemCard from "../CatalogItemCard/CatalogItemCard"
import type { ItemData } from "../../utils/types";
import { useDispatch } from "react-redux";
import { changeSearchQuery, clearSearchQuery } from "../../reducers/searchBarReducer";
import LoadMoreButton from "./LoadMoreButton";
import Preloader from "../Preloader";
import { useAppSelector } from "../../utils/hooks";

export default function CatalogBlock() {
    const [categories, setCategories] = useState<{
        selectedId: number,
        categoriesList: { id: number, title: string }[]
    }>({
        selectedId: 0,
        categoriesList: [{ id: 0, title: "Все" }]
    });
    const [currentItems, setCurrentItems] = useState<ItemData[]>();
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();


    const [catalogError, setCatalogError] = useState(null)
    const [categoriesError, setCategoriesError] = useState(null)

    const searchString = useAppSelector(state => state.search.query);
    const [currentSearchQuery, setCurrentSearchQuery] = useState(searchString ? searchString : "");
    async function getCategories() {
        fetch('http://localhost:7070/api/categories').
            then(response => response.json()).
            then(data => {
                if (categories.categoriesList.length == 1) {
                    setCategories({ selectedId: 0, categoriesList: categories.categoriesList.concat(data) });
                }
            }).
            catch(error => {
                setCategoriesError(error);
            });
    };

    async function getCurrentItems(resetOffset = false, customOffset?: number) {
        setLoading(true);
        const currentOffset = customOffset !== undefined ? customOffset : (resetOffset ? 0 : offset);

        fetch(`http://localhost:7070/api/items?categoryId=${categories.selectedId}&offset=${currentOffset}&q=${searchQuery} `).
            then(response => {return response.json()}).
            then(data => {
                if (resetOffset) {
                    setCurrentItems(data);
                }
                else {
                    let currentData: ItemData[] = [];
                    if (currentItems) {
                        for (let i = 0; i < currentItems.length; i++) {
                            currentData.push(currentItems[i]);
                        }
                    }
                    for (let i = 0; i < data.length; i++) {
                        currentData.push(data[i]);
                    }
                    setCurrentItems(currentData)
                };
                if (resetOffset) setOffset(0);
                setHasMore(data.length === 6);
            }).catch(error => {
                console.log(error);
                setCatalogError(error);
            }).
            finally(() => setLoading(false));
    };

    function getMore() {
        const newOffset = offset + 6;
        setOffset(newOffset);
        getCurrentItems(false, newOffset);
    };

    useEffect(() => {
        getCategories();
        if (currentSearchQuery && currentSearchQuery !== "") {
            setSearchQuery(currentSearchQuery);
            dispatch(clearSearchQuery());
        }
    }, []);

    useEffect(() => {
        getCurrentItems(true);
    }, [categories.selectedId, searchQuery]);

    useEffect(() => {
        currentItems ? console.log("current items") : console.log("null");
        currentItems ? setLoading(false) : setLoading(true);
    }, [currentItems]);


    const handleSubmit = (e: React.FormEvent) => {
        debugger;
        e.preventDefault();
        setSearchQuery(currentSearchQuery);
        dispatch(clearSearchQuery());

    };

    const handleSearch = (query: string) => {
        setCurrentSearchQuery(query);
    };

    return (
        <section className="catalog">
            <h2 className="text-center">Каталог</h2>
            <form className="catalog-search-form form-inline" onSubmit={(e) => handleSubmit(e)}>
                <input
                    className="form-control"
                    placeholder="Поиск"
                    name="searchKey"
                    value={currentSearchQuery}
                    onChange={(e) => handleSearch(e.target.value)} />
            </form>
            {!categoriesError &&
                <ul className="catalog-categories nav justify-content-center">
                    {categories && categories.categoriesList.map(item =>
                        <li className="nav-item" key={item.id}>
                            <a className={item.id == categories.selectedId ? "nav-link active" : "nav-link"}
                                onClick={() => setCategories({ selectedId: item.id, categoriesList: categories.categoriesList })}>
                                {item.title}
                            </a>
                        </li>
                    )}

                </ul>
            }
            {catalogError ? <div>
                <p>Ошибка при загрузке каталога</p>
                <button className="btn btn-outline-primary" onClick={() => { setCatalogError(null); getCurrentItems(); }}>Попробовать снова</button>
            </div> :
                <div className="row">
                    {!currentItems ? <Preloader /> :
                        currentItems.map(item => <div className="col-4" key={item.id}>
                            <CatalogItemCard catalogItem={item} />
                        </div>)
                    }
                </div>
            }
            {!catalogError && <div className="text-center">
                {hasMore && !loading && <LoadMoreButton status="show" onClick={() => getMore()} />}
                {loading && currentItems && <LoadMoreButton status="loading" onClick={() => getMore()} />}
            </div>}
        </section>
    )
}
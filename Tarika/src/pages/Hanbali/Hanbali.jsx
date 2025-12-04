import { useState, useEffect } from "react";
import "../../css/allawy.css";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
function HomePage() {
    //the constants
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [array, setArray] = useState([]);
    const [next, setNext] = useState([]);
    const [text, setText] = useState([]);

    // --- Section visibility controls ---
    const [sections, setSections] = useState({
      marriage: true,   // "الزواج"
      branches: false,   // "الفروع"
      roots: false,      // "الأصول"
      siblings: false,   // "الإخوة"
      uncle: false,      // "العمومة"
      obedience: false,  // "الولاء"
      kinship: false     // "ذوي الأرحام"
    });
    const [kinshipDisabled, setKinshipDisabled] = useState(false);

    //creating the ID for the objects of the list
    function createID() {
        //the ID check
        let ID = 1;
        for (let i = 0; i < list.length; i++) {
            if (ID == list[i].ID) {
                ID = ID + 1;
            }
        }
        //double check
        for (let i = 0; i < list.length; i++) {
            if (ID == list[i].ID) {
                ID = ID + 1;
            }
        }
        //triblr check
        for (let i = 0; i < list.length; i++) {
            if (ID == list[i].ID) {
                ID = ID + 1;
            }
        }
        return ID;
    }

    //the add function obviously
    function Add({ name, gen, con, rel, sex, nickname, kinship }) {
        let counter = 0;

        switch (con) {

            case 'marriage' :
                if(name == 'الزوج') {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].title == 'الزوجة') {
                            setText(<p>?</p>)
                            return;
                        } else if (list[i].title == name) {
                            setText(<p>تم إضافة الزوج مسبقا</p>)
                            return;
                        }
                    }
                } else {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].title == 'الزوج') {
                            setText(<p>?</p>)
                            return;
                        } else if (list[i].title == name) {
                            counter = counter + 1;
                            if (counter == 4) {
                                setText(<p>تم إضافة الزوجات مسبقا</p>)
                                return;
                            }
                        }
                    }
                }
                break;

            case 'root': for (let i = 0; i < list.length; i++) {
                            if (list[i].title == nickname) {
                                setText(<p>{`تم إضافة ${nickname} مسبقا`}</p>)
                                return;
                            }
                         }
                break;

            case 'obedience': for (let i = 0; i < list.length; i++) {
                if (list[i].title == name) {
                    setText(<p>{`تم إضافة ${name} مسبقا`}</p>)
                    return;
                }
            }
                break;
        }

        let kin = kinship ? true : false;
        setList([...list, { ID: createID(), title: name, gen, con, rel, sex, name: nickname, kin }]);
    }

    useEffect(() => {

        sections.kinship ? setList(list) : setList(list.filter(data => data.kin == false));

        let group = {};
        for (let i = 0; i < list.length; i++) {
            const name = list[i].name;
            if (group[name]) {
                group[name].count += 1;
            } else {
                group[name] = { count: 1, item: list[i] }
            }
        }

        let newArray = [];
        for (const name in group) {
            const count = group[name].count;
            newArray.push(
                <button
                    key={group[name].item.ID}
                    onClick={() => { setList(list.filter(data => data.name !== name)) }}>{
                    count > 1 ? `${name} ${count}` : `${name}`}
                </button>
            );
        }

        setArray(newArray);
    }, [list, sections.kinship]);

    // auto-disable "ذوي الأرحام" when any other (non-marriage) section exists (checkbox true)
    useEffect(() => {
      const othersExist = sections.branches || sections.roots || sections.siblings || sections.uncle || sections.obedience;
      if (othersExist) {
        // force hide kinship and mark disabled
        setSections(prev => ({ ...prev, kinship: false }));
        setKinshipDisabled(true);
      } else {
        // allow kinship checkbox to be toggled again
        setKinshipDisabled(false);
      }
    }, [sections.branches, sections.roots, sections.siblings, sections.uncle, sections.obedience]);

    useEffect(() => {
        if (array.length != 0) {
            setNext(<button className="light-button" onClick={() => navigate('/MCalc', { state: { list, kinship: sections.kinship } })}>بدء عملية الحساب</button>);
            setText(<p>لحذف العناصر إضغط على العناصر بالصندوق</p>)
        } else {
            setNext([]);
            setText(<p>إختر الورثة</p>)
        }
    }, [array, sections.kinship, list, navigate])

    // toggle handler for section checkboxes
    function toggleSection(key) {
      setSections(prev => ({ ...prev, [key]: !prev[key] }));
    }

    return (
        <div className='container'>
            <p style={{textAlign:"center", marginTop:'75px'}}>حساب الميراث على المذهب</p>
            <h1 style={{textAlign:"center", background:'white', border:"none"}}>الحنبلي</h1>

            <div id="items">
                {array}
            </div>
            <div id="total">
                {next} <br />
                {text}
            </div>

            <table style={{marginBottom:'150px', width:'100%'}}>
                {<thead onClick={() => toggleSection('marriage')}>
                    <tr>
                        <td colSpan={2}>
                            <label style={{margin:'0 6px'}}>
                                <input type="checkbox" checked={sections.marriage}/>
                                الزواج
                            </label>
                        </td>
                    </tr>
                </thead>}

                {sections.marriage && (
                <tbody>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الزوج', name: 'الزوج', gen: 0, con: 'marriage', rel: undefined, sex: "male" }) }}>الزوج</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الزوجة', name: 'الزوجة', gen: 0, con: 'marriage', rel: undefined, sex: "female" }) }}>الزوجة</button></td>
                    </tr>
                </tbody>
                )}

                {<thead onClick={() => toggleSection('branches')}>
                    <tr>
                        <td colSpan={2}>
                            <label style={{margin:'0 6px'}}>
                                <input type="checkbox" checked={sections.branches}/>
                                &nbsp;الفروع
                            </label>
                        </td>
                    </tr>
                </thead>}

                {sections.branches && (
                <tbody>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الإبن', name: 'الإبن', gen: 1, con: 'leaf', rel: undefined, sex: "male" }) }}>الإبن</button></td>
                        <td><button onClick={() => { Add({ nickname: 'البنت', name: 'البنت', gen: 1, con: 'leaf', rel: undefined, sex: "female" }) }}>البنت</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الإبن', name: 'إبن الإبن', gen: 2, con: 'leaf', rel: undefined, sex: "male" }) }}>إبن الإبن</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت الإبن', name: 'بنت الإبن', gen: 2, con: 'leaf', rel: undefined, sex: "female" }) }}>بنت الإبن</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن إبن الإبن', name: 'إبن إبن الإبن', gen: 3, con: 'leaf', rel: undefined, sex: "male" }) }}>إبن إبن الإبن</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت إبن الإبن', name: 'بنت إبن الإبن', gen: 3, con: 'leaf', rel: undefined, sex: "female" }) }}>بنت إبن الإبن</button></td>
                    </tr>
                </tbody>
                )}

                {<thead onClick={() => toggleSection('roots')}>
                    <tr>
                        <td colSpan={2}>
                            <label style={{margin:'0 6px'}}>
                                <input type="checkbox" checked={sections.roots}/>
                                &nbsp;الأصول
                            </label>
                        </td>
                    </tr>
                </thead>}

                {sections.roots && (
                <tbody>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الأب', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male" }) }}>الأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الأم', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female" }) }}>الأم</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'أب الأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male" }) }}>أب الأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'أم الأم', name: 'أم الأم', gen: -2, con: 'root', rel: "Mother Side", sex: "female" }) }}>أم الأم</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'أب أب الأب', name: 'أب أب الأب', gen: -3, con: 'root', rel: "Father Side", sex: "male" }) }}>أب أب الأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'أم أم الأم', name: 'أم أم الأم', gen: -3, con: 'root', rel: "Mother Side", sex: "female" }) }}>أم أم الأم</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button onClick={() => { Add({ nickname: 'أم الأب', name: 'أم الأب', gen: -2, con: 'root', rel: "Father Side", sex: "female" }) }}>أم الأب</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button onClick={() => { Add({ nickname: 'أم أم الأب', name: 'أم أم الأب', gen: -3, con: 'root', rel: "Father Side", sex: "female" }) }}>أم أم الأب</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button onClick={() => { Add({ nickname: 'أم أب الأب', name: 'أم أب الأب', gen: -3, con: 'root', rel: "Father Side", sex: "female" }) }}>أم أب الأب</button></td>
                    </tr>
                </tbody>
                )}

                {<thead onClick={() => toggleSection('siblings')}>
                    <tr>
                        <td colSpan={2}>
                            <label style={{margin:'0 6px'}}>
                                <input type="checkbox" checked={sections.siblings}/>
                                &nbsp;الإخوة
                            </label>
                        </td>
                    </tr>
                </thead>}

                {sections.siblings && (
                <tbody>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الأخ الشقيق', name: 'الأخ الشقيق', gen: 0, con: 'sibling', rel: "Both Side", sex: "male" }) }}>الأخ الشقيق</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الأخت الشقيقة', name: 'الأخت الشقيقة', gen: 0, con: 'sibling', rel: "Both Side", sex: "female" }) }}>الأخت الشقيقه</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الأخ لأب', name: 'الأخ لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "male" }) }}>الأخ لأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الأخت لأب', name: 'الأخت لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "female" }) }}>الأخت لأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الأخ لأم', name: 'الأخ لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "male" }) }}>الأخ لأم</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الأخت لأم', name: 'الأخت لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "female" }) }}>الأخت لأم</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الأخ الشقيق', name: 'إبن الأخ الشقيق', gen: 1, con: 'nephew', rel: "Both Side", sex: "male" }) }}>إبن الأخ الشقيق</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الأخ لأب', name: 'إبن الأخ لأب', gen: 1, con: 'nephew', rel: "Father Side", sex: "male" }) }}>إبن الأخ لأب</button></td>
                    </tr>
                </tbody>
                )}

                {<thead onClick={() => toggleSection('uncle')}>
                    <tr>
                        <td colSpan={2}>
                            <label style={{margin:'0 6px'}}>
                                <input type="checkbox" checked={sections.uncle}/>
                                &nbsp;العمومة
                            </label>
                        </td>
                    </tr>
                </thead>}

                {sections.uncle && (
                <tbody>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'العم الشقيق', name: 'العم الشقيق', gen: -1, con: 'uncle', rel: "Both Side", sex: "male" }) }}>العم الشقيق</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'العم لأب', name: 'العم لأب', gen: -1, con: 'uncle', rel: "Father Side", sex: "male" }) }}>العم لأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن العم الشقيق', name: 'إبن العم الشقيق', gen: 0, con: 'cousin', rel: "Both Side", sex: "male" }) }}>إبن العم الشقيق</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن العم لأب', name: 'إبن العم لأب', gen: 0, con: 'cousin', rel: "Father Side", sex: "male" }) }}>إبن العم لأب</button></td>
                    </tr>
                </tbody>
                )}

                {<thead onClick={() => toggleSection('obedience')}>
                    <tr>
                        <td colSpan={2}>
                            <label style={{margin:'0 6px'}}>
                                <input type="checkbox" checked={sections.obedience}/>
                                &nbsp;الولاء
                            </label>
                        </td>
                    </tr>
                </thead>}

                {sections.obedience && (
                <tbody>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'المعتق', name: 'المعتق', gen: undefined, con: 'obedience', rel: undefined, sex: "male" }) }}>المعتق</button></td>
                        <td><button onClick={() => { Add({ nickname: 'المعتقه', name: 'المعتقه', gen: undefined, con: 'obedience', rel: undefined, sex: "female" }) }}>المعتقه</button></td>
                    </tr>
                </tbody>
                )}

                {!kinshipDisabled ? <thead onClick={() => toggleSection('kinship')}>
                    <tr>
                        <td colSpan={2}>
                            <label style={{margin:'0 6px', opacity: kinshipDisabled ? 0.6 : 1}}>
                                <input type="checkbox" checked={sections.kinship} disabled={kinshipDisabled}/>
                                &nbsp;ذوي الأرحام 
                            </label>
                        </td>
                    </tr>
                </thead> : <tbody>
                    <tr>
                        <td colSpan={2}><p style={{textAlign:'center', backgroundColor:'darkgray'}}>&quot;ذوي الأرحام غير متوفر — يظهر تلقائياً إذا لم توجد أقسام أخرى بخلاف الزواج&quot;</p></td>
                    </tr>
                </tbody>}

                {sections.kinship && (<tbody>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن البنت', name: 'البنت', gen: 1, con: 'leaf', rel: undefined, sex: "female", kinship:sections.kinship }) }}>إبن البنت</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت البنت', name: 'البنت', gen: 1, con: 'leaf', rel: undefined, sex: "female", kinship:sections.kinship }) }}>بنت البنت</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن بنت الإبن', name: 'بنت الإبن', gen: 2, con: 'leaf', rel: undefined, sex: "female", kinship:sections.kinship }) }}>إبن بنت الإبن</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت بنت الإبن', name: 'بنت الإبن', gen: 2, con: 'leaf', rel: undefined, sex: "female", kinship:sections.kinship }) }}>بنت بنت الإبن</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'أب الأم', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>أب الأم</button></td>
                        <td><button onClick={() => { Add({ nickname: 'أم أب الأم', name: 'أم أب الأم', gen: -3, con: 'root', rel: "Mother Side", sex: "female" }) }}>أم أب الأم</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'العم لأم', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>العم لأم</button></td>
                        <td><button onClick={() => { Add({ nickname: 'العمة', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>العمة</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الخال', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>الخال</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الخالة', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>الخالة</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن العمة', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>إبن العمة</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت العمة', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>بنت العمة</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الخال', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>إبن الخال</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت الخال', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>بنت الخال</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الخالة', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>إبن الخالة</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت الخالة', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>بنت الخالة</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'عم لأم الأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>عم لأم الأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'عمة الأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>عمة الأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'أبو أم الأم', name: 'أم الأم', gen: -2, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>أبو أم الأم</button></td>
                        <td><button onClick={() => { Add({ nickname: 'أبو أم الأب', name: 'أم الأب', gen: -2, con: 'root', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>أبو أم الأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن عمة لأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>إبن عمة الأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت عمة لأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>بنت عمة الأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'خال الأم', name: 'أم الأم', gen: -2, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>خال الأم</button></td>
                        <td><button onClick={() => { Add({ nickname: 'خالةالأم', name: 'أم الأم', gen: -2, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>خالة الأم</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'خال الأب', name: 'أم الأب', gen: -2, con: 'root', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>خال الأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'خالة الأب', name: 'أم الأب', gen: -2, con: 'root', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>خالة الأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الأخت الشقيقة', name: 'الأخت الشقيقة', gen: 0, con: 'sibling', rel: "Both Side", sex: "female", kinship:sections.kinship }) }}>إبن الأخت الشقيقه</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت الأخت الشقيقة', name: 'الأخت الشقيقة', gen: 0, con: 'sibling', rel: "Both Side", sex: "female", kinship:sections.kinship }) }}>بنت الأخت الشقيقه</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الأخت لأب', name: 'الأخت لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>إبن الأخت لأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت الأخت لأب', name: 'الأخت لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>بنت الأخت لأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الأخت لأم', name: 'الأخت لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>إبن الأخت لأم</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت الأخت لأم', name: 'الأخت لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>بنت الأخت لأم</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'بنت الأخ الشقيق', name: 'الأخ الشقيق', gen: 0, con: 'sibling', rel: "Both Side", sex: "male", kinship:sections.kinship }) }}>بنت الأخ الشقيق</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت إبن الأخ الشقيق', name: 'إبن الأخ الشقيق', gen: 1, con: 'nephew', rel: "Both Side", sex: "male", kinship:sections.kinship }) }}>بنت إبن الأخ الشقيق</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'بنت الأخ لأب', name: 'الأخ لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>بنت الأخ لأب</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت إبن الأخ لأب', name: 'إبن الأخ لأب', gen: 1, con: 'nephew', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>بنت إبن الأخ لأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'بنت الأخ لأم', name: 'الأخ لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "male", kinship:sections.kinship }) }}>بنت الأخ لأم</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت العم الشقيق', name: 'العم الشقيق', gen: -1, con: 'uncle', rel: "Both Side", sex: "male", kinship:sections.kinship }) }}>بنت العم الشقيق</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'بنت العم لأب', name: 'العم لأب', gen: -1, con: 'uncle', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>بنت العم لأب</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'بنت إبن العم الشقيق', name: 'إبن العم الشقيق', gen: 0, con: 'cousin', rel: "Both Side", sex: "male", kinship:sections.kinship }) }}>بنت إبن العم الشقيق</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'بنت إبن العم لأب', name: 'إبن العم لأب', gen: 0, con: 'cousin', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>بنت إبن العم لأب</button></td>
                    </tr>
                </tbody>)}
            </table>
        </div>
    );
}

export default HomePage;
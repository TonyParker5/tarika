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
            setText(<p>إختر الورثة, ويمكن زيادة العدد بالضغل المتكرر</p>);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [array.length])

    // toggle handler for section checkboxes
    function toggleSection(key) {
      setSections(prev => ({ ...prev, [key]: !prev[key] }));
    }

    return (
        <div className='container'>
            <p style={{textAlign:"center"}}>حساب الميراث على المذهب</p>
            <h1 style={{textAlign:"center", background:'white', border:"none"}}>الشافعي</h1>

            <div id="items">
                {array}
            </div>
            <div id="total">
                {next} <br />
                {text}
            </div>

            <table style={{marginBottom:'50px', width:'100%'}}>
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
                        <td><button onClick={() => { Add({ nickname: 'الزوج', name: 'الزوج', gen: 0, con: 'marriage', rel: undefined, sex: "male" }) }}>{list.filter(data => data.name == 'الزوج').length > 0 ? `الزوج x ${list.filter(data => data.name == 'الزوج').length}` : 'الزوج'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الزوجة', name: 'الزوجة', gen: 0, con: 'marriage', rel: undefined, sex: "female" }) }}>{list.filter(data => data.name == 'الزوجة').length > 0 ? `الزوجة x ${list.filter(data => data.name == 'الزوجة').length}` : 'الزوجة'}</button></td>
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
                        <td><button onClick={() => { Add({ nickname: 'الإبن', name: 'الإبن', gen: 1, con: 'leaf', rel: undefined, sex: "male" }) }}>{list.filter(data => data.name == 'الإبن').length > 0 ? `الإبن x ${list.filter(data => data.name == 'الإبن').length}` : 'الإبن'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'البنت', name: 'البنت', gen: 1, con: 'leaf', rel: undefined, sex: "female" }) }}>{list.filter(data => data.name == 'البنت').length > 0 ? `البنت x ${list.filter(data => data.name == 'البنت').length}` : 'البنت'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الإبن', name: 'إبن الإبن', gen: 2, con: 'leaf', rel: undefined, sex: "male" }) }}>{list.filter(data => data.name == 'إبن الإبن').length > 0 ? `إبن الإبن x ${list.filter(data => data.name == 'إبن الإبن').length}` : 'إبن الإبن'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت الإبن', name: 'بنت الإبن', gen: 2, con: 'leaf', rel: undefined, sex: "female" }) }}>{list.filter(data => data.name == 'بنت الإبن').length > 0 ? `بنت الإبن x ${list.filter(data => data.name == 'بنت الإبن').length}` : 'بنت الإبن'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن إبن الإبن', name: 'إبن إبن الإبن', gen: 3, con: 'leaf', rel: undefined, sex: "male" }) }}>{list.filter(data => data.name == 'إبن إبن الإبن').length > 0 ? `إبن إبن الإبن x ${list.filter(data => data.name == 'إبن إبن الإبن').length}` : 'إبن إبن الإبن'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'بنت إبن الإبن', name: 'بنت إبن الإبن', gen: 3, con: 'leaf', rel: undefined, sex: "female" }) }}>{list.filter(data => data.name == 'بنت إبن الإبن').length > 0 ? `بنت إبن الإبن x ${list.filter(data => data.name == 'بنت إبن الإبن').length}` : 'بنت إبن الإبن'}</button></td>
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
                        <td><button onClick={() => { Add({ nickname: 'الأب', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male" }) }}>{list.filter(data => data.name == 'الأب').length > 0 ? `الأب x ${list.filter(data => data.name == 'الأب').length}` : 'الأب'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الأم', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female" }) }}>{list.filter(data => data.name == 'الأم').length > 0 ? `الأم x ${list.filter(data => data.name == 'الأم').length}` : 'الأم'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'أب الأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male" }) }}>{list.filter(data => data.name == 'أب الأب').length > 0 ? `أب الأب x ${list.filter(data => data.name == 'أب الأب').length}` : 'أب الأب'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'أم الأم', name: 'أم الأم', gen: -2, con: 'root', rel: "Mother Side", sex: "female" }) }}>{list.filter(data => data.name == 'أم الأم').length > 0 ? `أم الأم x ${list.filter(data => data.name == 'أم الأم').length}` : 'أم الأم'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'أب أب الأب', name: 'أب أب الأب', gen: -3, con: 'root', rel: "Father Side", sex: "male" }) }}>{list.filter(data => data.name == 'أب أب الأب').length > 0 ? `أب أب الأب x ${list.filter(data => data.name == 'أب أب الأب').length}` : 'أب أب الأب'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'أم أم الأم', name: 'أم أم الأم', gen: -3, con: 'root', rel: "Mother Side", sex: "female" }) }}>{list.filter(data => data.name == 'أم أم الأم').length > 0 ? `أم أم الأم x ${list.filter(data => data.name == 'أم أم الأم').length}` : 'أم أم الأم'}</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button onClick={() => { Add({ nickname: 'أم الأب', name: 'أم الأب', gen: -2, con: 'root', rel: "Father Side", sex: "female" }) }}>{list.filter(data => data.name == 'أم الأب').length > 0 ? `أم الأب x ${list.filter(data => data.name == 'أم الأب').length}` : 'أم الأب'}</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button onClick={() => { Add({ nickname: 'أم أم الأب', name: 'أم أم الأب', gen: -3, con: 'root', rel: "Father Side", sex: "female" }) }}>{list.filter(data => data.name == 'أم أم الأب').length > 0 ? `أم أم الأب x ${list.filter(data => data.name == 'أم أم الأب').length}` : 'أم أم الأب'}</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button onClick={() => { Add({ nickname: 'أم أب الأب', name: 'أم أب الأب', gen: -3, con: 'root', rel: "Father Side", sex: "female" }) }}>{list.filter(data => data.name == 'أم أب الأب').length > 0 ? `أم أب الأب x ${list.filter(data => data.name == 'أم أب الأب').length}` : 'أم أب الأب'}</button></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button onClick={() => { Add({ nickname: 'أم أب الأم', name: 'أم أب الأم', gen: -3, con: 'root', rel: "Mother Side", sex: "female" }) }}>{list.filter(data => data.name == 'أم أب الأم').length > 0 ? `أم أب الأم x ${list.filter(data => data.name == 'أم أب الأم').length}` : 'أم أب الأم'}</button></td>
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
                        <td><button onClick={() => { Add({ nickname: 'الأخ الشقيق', name: 'الأخ الشقيق', gen: 0, con: 'sibling', rel: "Both Side", sex: "male" }) }}>{list.filter(data => data.name == 'الأخ الشقيق').length > 0 ? `الأخ الشقيق x ${list.filter(data => data.name == 'الأخ الشقيق').length}` : 'الأخ الشقيق'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الأخت الشقيقة', name: 'الأخت الشقيقة', gen: 0, con: 'sibling', rel: "Both Side", sex: "female" }) }}>{list.filter(data => data.name == 'الأخت الشقيقة').length > 0 ? `الأخت الشقيقة x ${list.filter(data => data.name == 'الأخت الشقيقة').length}` : 'الأخت الشقيقة'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الأخ لأب', name: 'الأخ لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "male" }) }}>{list.filter(data => data.name == 'الأخ لأب').length > 0 ? `الأخ لأب x ${list.filter(data => data.name == 'الأخ لأب').length}` : 'الأخ لأب'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الأخت لأب', name: 'الأخت لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "female" }) }}>{list.filter(data => data.name == 'الأخت لأب').length > 0 ? `الأخت لأب x ${list.filter(data => data.name == 'الأخت لأب').length}` : 'الأخت لأب'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'الأخ لأم', name: 'الأخ لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "male" }) }}>{list.filter(data => data.name == 'الأخ لأم').length > 0 ? `الأخ لأم x ${list.filter(data => data.name == 'الأخ لأم').length}` : 'الأخ لأم'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'الأخت لأم', name: 'الأخت لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "female" }) }}>{list.filter(data => data.name == 'الأخت لأم').length > 0 ? `الأخت لأم x ${list.filter(data => data.name == 'الأخت لأم').length}` : 'الأخت لأم'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الأخ الشقيق', name: 'إبن الأخ الشقيق', gen: 1, con: 'nephew', rel: "Both Side", sex: "male" }) }}>{list.filter(data => data.name == 'إبن الأخ الشقيق').length > 0 ? `إبن الأخ الشقيق x ${list.filter(data => data.name == 'إبن الأخ الشقيق').length}` : 'إبن الأخ الشقيق'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن الأخ لأب', name: 'إبن الأخ لأب', gen: 1, con: 'nephew', rel: "Father Side", sex: "male" }) }}>{list.filter(data => data.name == 'إبن الأخ لأب').length > 0 ? `إبن الأخ لأب x ${list.filter(data => data.name == 'إبن الأخ لأب').length}` : 'إبن الأخ لأب'}</button></td>
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
                        <td><button onClick={() => { Add({ nickname: 'العم الشقيق', name: 'العم الشقيق', gen: -1, con: 'uncle', rel: "Both Side", sex: "male" }) }}>{list.filter(data => data.name == 'العم الشقيق').length > 0 ? `العم الشقيق x ${list.filter(data => data.name == 'العم الشقيق').length}` : 'العم الشقيق'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'العم لأب', name: 'العم لأب', gen: -1, con: 'uncle', rel: "Father Side", sex: "male" }) }}>{list.filter(data => data.name == 'العم لأب').length > 0 ? `العم لأب x ${list.filter(data => data.name == 'العم لأب').length}` : 'العم لأب'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن العم الشقيق', name: 'إبن العم الشقيق', gen: 0, con: 'cousin', rel: "Both Side", sex: "male" }) }}>{list.filter(data => data.name == 'إبن العم الشقيق').length > 0 ? `إبن العم الشقيق x ${list.filter(data => data.name == 'إبن العم الشقيق').length}` : 'إبن العم الشقيق'}</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => { Add({ nickname: 'إبن العم لأب', name: 'إبن العم لأب', gen: 0, con: 'cousin', rel: "Father Side", sex: "male" }) }}>{list.filter(data => data.name == 'إبن العم لأب').length > 0 ? `إبن العم لأب x ${list.filter(data => data.name == 'إبن العم لأب').length}` : 'إبن العم لأب'}</button></td>
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
                        <td><button onClick={() => { Add({ nickname: 'المعتق', name: 'المعتق', gen: undefined, con: 'obedience', rel: undefined, sex: "male" }) }}>{list.filter(data => data.name == 'المعتق').length > 0 ? `المعتق x ${list.filter(data => data.name == 'المعتق').length}` : 'المعتق'}</button></td>
                        <td><button onClick={() => { Add({ nickname: 'المعتقه', name: 'المعتقه', gen: undefined, con: 'obedience', rel: undefined, sex: "female" }) }}>{list.filter(data => data.name == 'المعتقه').length > 0 ? `المعتقه x ${list.filter(data => data.name == 'المعتقه').length}` : 'المعتقه'}</button></td>
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
                            <td><button onClick={() => { Add({ nickname: 'إبن البنت', name: 'البنت', gen: 1, con: 'leaf', rel: undefined, sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن البنت').length > 0 ? `إبن البنت x ${list.filter(data => data.name == 'إبن البنت').length}` : 'إبن البنت'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت البنت', name: 'البنت', gen: 1, con: 'leaf', rel: undefined, sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت البنت').length > 0 ? `بنت البنت x ${list.filter(data => data.name == 'بنت البنت').length}` : 'بنت البنت'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'إبن بنت الإبن', name: 'بنت الإبن', gen: 2, con: 'leaf', rel: undefined, sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن بنت الإبن').length > 0 ? `إبن بنت الإبن x ${list.filter(data => data.name == 'إبن بنت الإبن').length}` : 'إبن بنت الإبن'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت بنت الإبن', name: 'بنت الإبن', gen: 2, con: 'leaf', rel: undefined, sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت بنت الإبن').length > 0 ? `بنت بنت الإبن x ${list.filter(data => data.name == 'بنت بنت الإبن').length}` : 'بنت بنت الإبن'}</button></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><button onClick={() => { Add({ nickname: 'أب الأم', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'أب الأم').length > 0 ? `أب الأم x ${list.filter(data => data.name == 'أب الأم').length}` : 'أب الأم'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'العم لأم', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'العم لأم').length > 0 ? `العم لأم x ${list.filter(data => data.name == 'العم لأم').length}` : 'العم لأم'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'العمة', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'العمة').length > 0 ? `العمة x ${list.filter(data => data.name == 'العمة').length}` : 'العمة'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'الخال', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'الخال').length > 0 ? `الخال x ${list.filter(data => data.name == 'الخال').length}` : 'الخال'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'الخالة', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'الخالة').length > 0 ? `الخالة x ${list.filter(data => data.name == 'الخالة').length}` : 'الخالة'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'إبن العمة', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن العمة').length > 0 ? `إبن العمة x ${list.filter(data => data.name == 'إبن العمة').length}` : 'إبن العمة'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت العمة', name: 'الأب', gen: -1, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت العمة').length > 0 ? `بنت العمة x ${list.filter(data => data.name == 'بنت العمة').length}` : 'بنت العمة'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'إبن الخال', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن الخال').length > 0 ? `إبن الخال x ${list.filter(data => data.name == 'إبن الخال').length}` : 'إبن الخال'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت الخال', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت الخال').length > 0 ? `بنت الخال x ${list.filter(data => data.name == 'بنت الخال').length}` : 'بنت الخال'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'إبن الخالة', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن الخالة').length > 0 ? `إبن الخالة x ${list.filter(data => data.name == 'إبن الخالة').length}` : 'إبن الخالة'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت الخالة', name: 'الأم', gen: -1, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت الخالة').length > 0 ? `بنت الخالة x ${list.filter(data => data.name == 'بنت الخالة').length}` : 'بنت الخالة'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'عم لأم الأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'عم لأم الأب').length > 0 ? `عم لأم الأب x ${list.filter(data => data.name == 'عم لأم الأب').length}` : 'عم لأم الأب'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'عمة الأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'عمة الأب').length > 0 ? `عمة الأب x ${list.filter(data => data.name == 'عمة الأب').length}` : 'عمة الأب'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'أبو أم الأم', name: 'أم الأم', gen: -2, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'أبو أم الأم').length > 0 ? `أبو أم الأم x ${list.filter(data => data.name == 'أبو أم الأم').length}` : 'أبو أم الأم'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'أبو أم الأب', name: 'أم الأب', gen: -2, con: 'root', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'أبو أم الأب').length > 0 ? `أبو أم الأب x ${list.filter(data => data.name == 'أبو أم الأب').length}` : 'أبو أم الأب'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'إبن عمة لأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن عمة لأب').length > 0 ? `إبن عمة لأب x ${list.filter(data => data.name == 'إبن عمة لأب').length}` : 'إبن عمة لأب'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت عمة لأب', name: 'أب الأب', gen: -2, con: 'root', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت عمة لأب').length > 0 ? `بنت عمة لأب x ${list.filter(data => data.name == 'بنت عمة لأب').length}` : 'بنت عمة لأب'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'خال الأم', name: 'أم الأم', gen: -2, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'خال الأم').length > 0 ? `خال الأم x ${list.filter(data => data.name == 'خال الأم').length}` : 'خال الأم'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'خالةالأم', name: 'أم الأم', gen: -2, con: 'root', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'خالةالأم').length > 0 ? `خالة الأم x ${list.filter(data => data.name == 'خالةالأم').length}` : 'خالة الأم'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'خال الأب', name: 'أم الأب', gen: -2, con: 'root', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'خال الأب').length > 0 ? `خال الأب x ${list.filter(data => data.name == 'خال الأب').length}` : 'خال الأب'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'خالة الأب', name: 'أم الأب', gen: -2, con: 'root', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'خالة الأب').length > 0 ? `خالة الأب x ${list.filter(data => data.name == 'خالة الأب').length}` : 'خالة الأب'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'إبن الأخت الشقيقة', name: 'الأخت الشقيقة', gen: 0, con: 'sibling', rel: "Both Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن الأخت الشقيقة').length > 0 ? `إبن الأخت الشقيقة x ${list.filter(data => data.name == 'إبن الأخت الشقيقة').length}` : 'إبن الأخت الشقيقة'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت الأخت الشقيقة', name: 'الأخت الشقيقة', gen: 0, con: 'sibling', rel: "Both Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت الأخت الشقيقة').length > 0 ? `بنت الأخت الشقيقة x ${list.filter(data => data.name == 'بنت الأخت الشقيقة').length}` : 'بنت الأخت الشقيقة'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'إبن الأخت لأب', name: 'الأخت لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن الأخت لأب').length > 0 ? `إبن الأخت لأب x ${list.filter(data => data.name == 'إبن الأخت لأب').length}` : 'إبن الأخت لأب'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت الأخت لأب', name: 'الأخت لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت الأخت لأب').length > 0 ? `بنت الأخت لأب x ${list.filter(data => data.name == 'بنت الأخت لأب').length}` : 'بنت الأخت لأب'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'إبن الأخت لأم', name: 'الأخت لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'إبن الأخت لأم').length > 0 ? `إبن الأخت لأم x ${list.filter(data => data.name == 'إبن الأخت لأم').length}` : 'إبن الأخت لأم'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت الأخت لأم', name: 'الأخت لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "female", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت الأخت لأم').length > 0 ? `بنت الأخت لأم x ${list.filter(data => data.name == 'بنت الأخت لأم').length}` : 'بنت الأخت لأم'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'بنت الأخ الشقيق', name: 'الأخ الشقيق', gen: 0, con: 'sibling', rel: "Both Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت الأخ الشقيق').length > 0 ? `بنت الأخ الشقيق x ${list.filter(data => data.name == 'بنت الأخ الشقيق').length}` : 'بنت الأخ الشقيق'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت إبن الأخ الشقيق', name: 'إبن الأخ الشقيق', gen: 1, con: 'nephew', rel: "Both Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت إبن الأخ الشقيق').length > 0 ? `بنت إبن الأخ الشقيق x ${list.filter(data => data.name == 'بنت إبن الأخ الشقيق').length}` : 'بنت إبن الأخ الشقيق'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'بنت الأخ لأب', name: 'الأخ لأب', gen: 0, con: 'sibling', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت الأخ لأب').length > 0 ? `بنت الأخ لأب x ${list.filter(data => data.name == 'بنت الأخ لأب').length}` : 'بنت الأخ لأب'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت إبن الأخ لأب', name: 'إبن الأخ لأب', gen: 1, con: 'nephew', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت إبن الأخ لأب').length > 0 ? `بنت إبن الأخ لأب x ${list.filter(data => data.name == 'بنت إبن الأخ لأب').length}` : 'بنت إبن الأخ لأب'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'بنت الأخ لأم', name: 'الأخ لأم', gen: 0, con: 'sibling', rel: "Mother Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت الأخ لأم').length > 0 ? `بنت الأخ لأم x ${list.filter(data => data.name == 'بنت الأخ لأم').length}` : 'بنت الأخ لأم'}</button></td>
                            <td><button onClick={() => { Add({ nickname: 'بنت العم الشقيق', name: 'العم الشقيق', gen: -1, con: 'uncle', rel: "Both Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت العم الشقيق').length > 0 ? `بنت العم الشقيق x ${list.filter(data => data.name == 'بنت العم الشقيق').length}` : 'بنت العم الشقيق'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'بنت العم لأب', name: 'العم لأب', gen: -1, con: 'uncle', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت العم لأب').length > 0 ? `بنت العم لأب x ${list.filter(data => data.name == 'بنت العم لأب').length}` : 'بنت العم لأب'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'بنت إبن العم الشقيق', name: 'إبن العم الشقيق', gen: 0, con: 'cousin', rel: "Both Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت إبن العم الشقيق').length > 0 ? `بنت إبن العم الشقيق x ${list.filter(data => data.name == 'بنت إبن العم الشقيق').length}` : 'بنت إبن العم الشقيق'}</button></td>
                        </tr>
                        <tr>
                            <td><button onClick={() => { Add({ nickname: 'بنت إبن العم لأب', name: 'إبن العم لأب', gen: 0, con: 'cousin', rel: "Father Side", sex: "male", kinship:sections.kinship }) }}>{list.filter(data => data.name == 'بنت إبن العم لأب').length > 0 ? `بنت إبن العم لأب x ${list.filter(data => data.name == 'بنت إبن العم لأب').length}` : 'بنت إبن العم لأب'}</button></td>
                        </tr>
                </tbody>)}
            </table>
        </div>
    );
}

export default HomePage;
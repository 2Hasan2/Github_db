$('#form').submit(function (e) {
    e.preventDefault();
    const name = $('#name').val();
    const age = $('#age').val();
    console.log(typeof name, typeof age);
    if (name != '' && age != '') {
        putJson(name, age);
    } else {
        alert('please fill the form');
    }
});

const apiUrl = 'https://api.github.com/repos/0Hasan0/Github_API/contents/json.json';
const authToken = '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';

const getJson = async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return { sha: data.sha, decodedContent: atob(data.content) };
};

const putJson = async (name, age, clear = false) => {
    let previousContent = await getJson().then(data => JSON.parse(data.decodedContent));
    console.log(...previousContent);
    const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${authToken}`
        },
        body: JSON.stringify({
            message: 'update json file',
            content: btoa(JSON.stringify(clear ? [] : [...previousContent, { name, age }])),
            sha: await getJson().then(data => data.sha)
        })
    });
    const data = await response.json();
    console.log(data);
    setTimeout(() => {
        showData();
    }, 200);
}

const showData = async () => {
    const data = await getJson().then(data => {
        $('tbody').html('');
        JSON.parse(data.decodedContent).forEach(item => {
            $('tbody').append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.age}</td>
            </tr>
            `);

        });
    });

}
showData();

$('#clear').click(function () {
    // prompt('are you sure?');
    let clear = confirm('are you sure?');
    if (clear) {
        putJson('', '', true);
        $('tbody').html('');
    }

});
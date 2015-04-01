$(document).ready(function() {
    $('#filter_form').filterForm({
    	rowElems: [
    		{
				tag: 'input',
				type: 'text',
				'name': 'first_name',
				cl: null,
				placeholder: 'First Name'
			},
			{
				tag: 'input',
				type: 'text',
				'name': 'last_name',
				cl: null,
				placeholder: 'Last Name'
			},
			{
				tag: 'input',
				type: 'checkbox',
				'name': 'is_passport',
				cl: null,
				placeholder: 'Do you have passport?'
			},
			{
				tag: 'textarea',
				'name': 'address',
				cl: null,
				placeholder: 'Address'
			},
			{
				tag: 'select',
				opts: [
					{
						text: '- Choose Country -'
					},
					{
						text: 'India',
						value: 'IN'
					},
					{
						text: 'United States of America',
						value: 'USA'
					},
					{
						text: 'New Zealand',
						value: 'NZ'
					}
				],
				'name': 'value',
				cl: null,
				placeholder: 'Value'
			}
    	],
    	rowLimit: 2,
    	subRowLimit:4
    });
});

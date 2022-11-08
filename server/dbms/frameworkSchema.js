/*****
 * Copyright (c) 2017-2022 Christoph Wittmann, chris.wittmann@icloud.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*****/


/*****
 * The DBMS schemas that are standard or default to the server framework.  Each
 * defined schema is automatically loaded while bootstrapping the server and is
 * available to the server framework as well as other modules.  I've tried to
 * make separate logically organized schemas so that they may be replicated as
 * needed and found useful by outside module developers.
*****/
mkDbSchema(
    '##FRAMEWORK',
    true,
    {
        name: 'address',
        columns: [
            { name: 'ownerType',    type: dbText, size:  20 },
            { name: 'ownerOid',     type: dbInt64           },
            { name: 'street',       type: dbText, size: 100 },
            { name: 'building',     type: dbText, size:  50 },
            { name: 'suite',        type: dbText, size:  50 },
            { name: 'box',          type: dbText, size:  20 },
            { name: 'city',         type: dbText, size: 100 },
            { name: 'region',       type: dbText, size: 100 },
            { name: 'postalCode',   type: dbText, size:  20 },
            { name: 'countryCode',  type: dbText, size:   6 },
            { name: 'verified',     type: dbBool            },
            { name: 'lastVerified', type: dbTime            },
        ],
        indexes: [
            'ownerType:asc, ownerOid:asc',
        ]
    },
    {
        name: 'auth',
        columns: [
            { name: 'userOid',    type: dbInt64 },
            { name: 'grants',     type: dbJson  },
            { name: 'denies',     type: dbJson  },
        ],
        indexes: [
            'userOid:asc',
        ]
    },
    {
        name: 'credentials',
        columns: [
            { name: 'userOid',    type: dbInt64            },
            { name: 'crypto',     type: dbText, size: 1000 },
            { name: 'expires',    type: dbTime             },
        ],
        indexes: [
            'userOid:asc',
        ]
    },
    {
        name: 'domain',
        columns: [
            { name: 'name',         type: dbText, size: 200 },
            { name: 'tld',          type: dbText, size:  20 },
            { name: 'isVerified',   type: dbBool            },
            { name: 'lastVerified', type: dbTime            },
        ],
        indexes: [
            'name:asc',
            'tld:asc',
        ]
    },
    {
        name: 'emailAddr',
        columns: [
            { name: 'domainOid',    type: dbInt64           },
            { name: 'user',         type: dbText, size: 200 },
            { name: 'addr',         type: dbText, size: 200 },
            { name: 'verified',     type: dbBool            },
            { name: 'lastVerified', type: dbTime            },
        ],
        indexes: [
            'domainOid:asc',
            'user:asc',
            'addr:asc',
        ]
    },
    {
        name: 'httpLog',
        columns: [
            { name: 'ipAddr',       type: dbText, size:  50 },
            { name: 'cipher',       type: dbText, size:  50 },
            { name: 'method',       type: dbText, size:  20 },
            { name: 'url',          type: dbText, size: 400 },
            { name: 'headers',      type: dbJson, size: 900 },
            { name: 'status',       type: dbInt32           },
        ],
        indexes: [
            'ipAddr:asc',
            'method:asc',
            'url:asc',
            'status:asc',
        ]
    },
    {
        name: 'org',
        columns: [
            { name: 'name',        type: dbText, size: 50 },
            { name: 'category',    type: dbText, size: 50 },
            { name: 'description', type: dbText, size:100 },
        ],
        indexes: [
            'name:asc',
        ]
    },
    {
        name: 'phone',
        columns: [
            { name: 'ownerType',   type: dbText, size:   20 },
            { name: 'ownerOid',    type: dbInt64            },
            { name: 'country',     type: dbText, size:   10 },
            { name: 'region',      type: dbText, size:   20 },
            { name: 'number',      type: dbText, size:  200 },
            { name: 'unformatted', type: dbText, size:  200 },
            { name: 'formatted',   type: dbText, size:  200 },
            { name: 'allowMms',    type: dbBool             }
        ],
        indexes: [
            'ownerType:asc, ownerOid:asc',
            'unformatted:asc',
        ]
    },
    {
        name: 'setting',
        columns: [
            { name: 'name',        type: dbText, size:   50 },
            { name: 'value',       type: dbJson, size: 2000 },
        ],
        indexes: [
            'name:asc',
        ]
    },
    {
        name: 'systemLog',
        columns: [
            { name: 'message',     type: dbText, size: 2000 },
        ],
        indexes: [
        ]
    },
    {
        name: 'user',
        columns: [
            { name: 'orgOid',    type: dbInt64           },
            { name: 'userName',  type: dbText, size: 100 },
            { name: 'firstName', type: dbText, size: 100 },
            { name: 'lastName',  type: dbText, size: 100 },
            { name: 'title',     type: dbText, size:  20 },
            { name: 'suffix',    type: dbText, size:  20 },
        ],
        indexes: [
            'orgOid:asc',
            'userName:asc',
            'lastName:asc',
            'firstName:asc',
            'lastName:asc, firstName:asc',
        ]
    },
);
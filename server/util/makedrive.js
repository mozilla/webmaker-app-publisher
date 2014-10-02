module.exports = {
    getFile: function (username, filename, cb) {
        // Replace with real makedrive stuff
        // Fake data for now
        cb({
            apps: [
                {
                    "id": "808cf77d-73ec-4645-a8ba-8612cfc464a3",
                    "name": "Hello world app",
                    "icon": "/images/placeholder_journalist.png",
                    "active": true,
                    "author": {
                        "name": null,
                        "location": null,
                        "avatar": null
                    },
                    "blocks": [
                        {
                            "name": "phone",
                            "icon": "/images/blocks_phone.png",
                            "attributes": {
                                "number": {
                                    "label": "Phone #",
                                    "type": "string",
                                    "value": "+18005555555"
                                },
                                "innerHTML": {
                                    "label": "Label",
                                    "type": "string",
                                    "value": "Place call"
                                }
                            },
                            "id": "phone",
                            "index": "0",
                            "title": "Edit",
                            "back": true
                        },
                        {
                            "name": "SMS",
                            "icon": "/images/blocks_sms.png",
                            "attributes": {
                                "value": {
                                    "label": "Phone #",
                                    "type": "string",
                                    "value": "+18005555555"
                                },
                                "messageBody": {
                                    "label": "Message",
                                    "type": "string",
                                    "value": "Hello world one two three"
                                },
                                "innerHTML": {
                                    "label": "Label",
                                    "type": "string",
                                    "value": "Send SMS!"
                                }
                            },
                            "id": "sms",
                            "index": "0",
                            "title": "Edit",
                            "back": true
                        },
                        {
                            "id": "image",
                            "attributes": {
                                "src": {
                                    "id": "src",
                                    "label": "Image URL",
                                    "type": "string",
                                    "value": "/content/journalist_3g.jpg"
                                }
                            },
                            "name": "Image",
                            "icon": "/images/blocks_image.png"
                        },
                        {
                            "id": "text",
                            "attributes": {
                                "innerHTML": {
                                    "id": "innerHTML",
                                    "label": "Text Value",
                                    "type": "string",
                                    "value": "Only 4% of Total Users on 3G"
                                },
                                "color": {
                                    "id": "color",
                                    "label": "Text Color",
                                    "type": "color",
                                    "value": "#000000"
                                }
                            },
                            "name": "Text",
                            "icon": "/images/blocks_text.png"
                        },
                        {
                            "id": "text",
                            "attributes": {
                                "innerHTML": {
                                    "id": "innerHTML",
                                    "label": "Text Value",
                                    "type": "string",
                                    "value": "Only 4.15% of the total mobile phone users have started enjoying third generation mobile broadband data services, according to regulator.\n\nAfter the private mobile phone operators of the country launched 3G services at the end of October last year, the total number of 3G users crossed 48.45 lakh till the end of July this year.\n\nThe number of total active SIM cards stood at 11.68 crore, said Bangladesh Telecommunication Regulatory Commission (BTRC) data.\n\nRecently, BTRC collected the number of 3G users of the country as the regulator inspected the 3G service roll-out and network quality of the operators.\n\nAccording to the data, Robi, the third largest operator in the country in terms of total active users, became the market leader with 13.05 lakh 3G connections.\n\nThe number of total active SIM users of Robi reached 2.42 crore as of July 2014."
                                },
                                "color": {
                                    "id": "color",
                                    "label": "Text Color",
                                    "type": "color",
                                    "value": "#000000"
                                }
                            },
                            "name": "Text",
                            "icon": "/images/blocks_text.png",
                            "index": "4",
                            "title": "Edit",
                            "back": true
                        },
                        {
                            "id": "image",
                            "attributes": {
                                "src": {
                                    "id": "src",
                                    "label": "Image URL",
                                    "type": "string",
                                    "value": "/content/journalist_weather.jpg"
                                }
                            },
                            "name": "Image",
                            "icon": "/images/blocks_image.png"
                        },
                        {
                            "id": "text",
                            "attributes": {
                                "innerHTML": {
                                    "id": "innerHTML",
                                    "label": "Text Value",
                                    "type": "string",
                                    "value": "Heavy Rainfall Expected"
                                },
                                "color": {
                                    "id": "color",
                                    "label": "Text Color",
                                    "type": "color",
                                    "value": "#000000"
                                }
                            },
                            "name": "Text",
                            "icon": "/images/blocks_text.png"
                        },
                        {
                            "id": "text",
                            "attributes": {
                                "innerHTML": {
                                    "id": "innerHTML",
                                    "label": "Text Value",
                                    "type": "string",
                                    "value": "A weather forecast report has expected that a heavy to very heavy rainfall may arise at places over Dhaka, Khulna, Barisal, Chittagong and Sylhet divisions during the next twenty four hours commencing at 11 am on Saturday, BSS reports.\n\nThe rainfall may cause landslide at places over the hilly regions of Chittagong and Sylhet divisions, the report said.\n\nLocal cautionary signal No-three is suggested to keep hoist in Maritime ports of Chittagong, Cox's Bazar, Mongla and Payra.\n\nAll fishing boats and trawlers over North Bay have been advised to remain close to the coast and proceed with caution till further notice, it added.\n\nThe highest rainfall was recorded by 256 millimeters (mm) for last 24 hours at Sandwip followed by 241 mm held at Teknaf."
                                },
                                "color": {
                                    "id": "color",
                                    "label": "Text Color",
                                    "type": "color",
                                    "value": "#000000"
                                }
                            },
                            "name": "Text",
                            "icon": "/images/blocks_text.png"
                        }
                    ]
                }

            ]
        });
    }
};

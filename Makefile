export SENDER_KEY  := AAAAKmVi1kc:APA91bFoKsHBKyVIIGkfJhw7hTkSEbNuC3X3hl2VH2N6tjgx-sU-SJM1x8fnpC736UvV72jHc3M7v7U5JEt7LJl3b5xPDLtCciwSC--xez_s9rcHCvxC_5U8bSIY6dPIRot7e8vnG2UososXjKiaXLcfPjOugJxvqw
export RECIVER_KEY := fHH18RS2ToY:APA91bGEAEbhpL6W3NW_TDcryH9YBgRX9HL-PfjwOg5EltexRCXCLdBoy2IeGmjuspp6qLM8WNh1QkwM0c7fj13u0RMH-np-0BGqNaiyiL4GlLFf6bhpLKB-X396sgYZJD5DVS-dGiAA
export TITLE			 := "WakeMeUp 背景通知"
export BODY				 := "5566"
export REQUEST_URL := https://fcm.googleapis.com/fcm/send

define NOTIFICATION
{ 
	"to": "$(RECIVER_KEY)", 
	"notification": { 
		"title": $(TITLE), 
		"body": $(BODY), 
		"icon": "./images/Firebase.png", 
		"click_action": "https://wakemeup.oawan.me/" 
	}
}
endef
export NOTIFICATION

send:
	@curl \
	-H "Authorization: key=$(SENDER_KEY)" \
	-H "Content-Type: application/json" \
	-d "$$NOTIFICATION" \
	"$(REQUEST_URL)"
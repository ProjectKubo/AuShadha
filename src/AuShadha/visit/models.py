##################################
# Models for AuShadha OPD Visits.
# Copyright Dr. Easwar TR 25/12/2012
# LICENSE : GNU-GPL Version 3
##################################

#Django Specific Imports
from django.db import models
from django.forms import ModelForm, Textarea, TextInput

#General Imports
from datetime import datetime, date, time

#Application model imports
from aushadha_base_model import AuShadhaBaseModel
from patient.models import PatientDetail
#from admission.models import PatientDetail
#from staff.models import Staff
#from nurse.models import NurseDetail
#from surgeon.models import SurgeonDetail


CONSULT_NATURE_CHOICES = (
                            ('initial','Intial'),
                            ('fu'     ,'Follow-Up'),
                            ('na'     ,'Non-Appointment'),
                            ('emer'   ,'Emergency'),
                            ('pre_op' ,'Pre-OP Counsel'),
                            ('post_op','Post-OP Review'),
                          )

CONSULT_STATUS_CHOICES =(
                        ('review_awaited'          , 'Review Awaited'),
                        ('inv_awaited'             , 'Investigations Awaited'),
                        ('consults_awaited'        , 'Consults Awaited'),
                        ('admission'               , 'Admission'),
                        ('discharged'              , 'Discharged'),
                      )

# Models start here..

class VisitDetail(AuShadhaBaseModel):
  patient_detail   = models.ForeignKey('patient.PatientDetail')
  visit_date       = models.DateTimeField(auto_now = False, default = datetime.today())
  #op_surgeon       = models.ForeignKey('surgeon.SurgeonDetail')
  referring_doctor = models.CharField(max_length = 30, default = "Self")
  consult_nature   = models.CharField(max_length = 30, choices = CONSULT_NATURE_CHOICES)
  status           = models.CharField(max_length = 30, choices = CONSULT_STATUS_CHOICES)
  is_active        = models.BooleanField(default = True, editable = False)
#  visit_detail    = models.ForeignKey('self')
  remarks          = models.TextField(max_length = 200,
                                      default    = "NAD",
                                      help_text  = "limit to 200 words"
                                     )

  class Meta:
    verbose_name        = "Visit Details"
    verbose_name_plural = "Visit Details"

  def __unicode__(self):
    #return '%s: %s: %s' %(self.patient_detail, self.visit_date.date(),self.op_surgeon)



  def visit_nature(self):
    return unicode(self.consult_nature)

  def visit_nature_change(self, nature):
    try:
      self.consult_nature = unicode(nature)
    except (TypeError, NameError, ValueError):
      print "ERROR:: Invalid CONSULT_NATURE_CHOICE supplied.."
      return False
    if consult_nature in ['initial','fu', 'na','emer','pre_op','post_op']:
        self.save()
        return unicode(self.consult_nature)
    else:
      print "ERROR:: Invalid Consult Nature Change Requested.."
      return False

  def visit_status(self):
    return unicode(self.status)

  def visit_status_change(self, status):
    try:
      self.status = unicode(status)
    except (TypeError, NameError, ValueError):
      print "ERROR:: Invalid CONSULT_STATUS_CHOICE supplied.."
      return False
    if status in ['discharged','admission','review_awaited','inv_awaited','consults_awaited']:
      if self.status == 'discharged' or \
         self.status == 'admission':
         self._close_visit()
      else:
        self.is_active = True
        self.save()
      return unicode(self.status)
    else:
      print "ERROR:: Invalid Consult Status Change Requested.."
      return False

  def _close_visit(self):
    self.is_active = False
    self.save()

  def has_phy_exam(self):
    ''' Returns whether a chosen Admission Object has already a Physical Exam Recorded for Discharge Summary '''
    from phyexam.models import PhyExam
    id = self.id
    try:
      visit_object = VisitDetail.objects.get(pk = id)
    except (TypeError, ValueError, AttributeError, VisitDetail.DoesNotExist):
      return False
    phy_exam_object = PhyExam.objects.filter(visit_detail = visit_object)
    phy_exam_count = unicode(len(phy_exam_object))
    if phy_exam_object == True:
      return phy_exam_count
    else:
      phy_exam_count == '0'
      return phy_exam_count

  def is_visit_active(self):
    if self.is_active:
      return True
    else:
      return False


## ModelForm start here..

class VisitDetailForm(ModelForm):
  class Meta:
    model   = VisitDetail
    widgets = {'patient_detail': TextInput(attrs={'readonly':'readonly'}),
#               'visit_detail'  : TextInput(attrs={'readonly':'readonly'})
              }
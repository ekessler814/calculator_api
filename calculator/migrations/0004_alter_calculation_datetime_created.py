# Generated by Django 4.0.5 on 2022-06-21 05:53

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('calculator', '0003_alter_calculation_result_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calculation',
            name='datetime_created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]